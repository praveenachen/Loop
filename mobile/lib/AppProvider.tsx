import {
  createContext, useContext, useEffect, useState, useCallback, useRef,
  type ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { AppState } from "react-native";
import { mobileApi, request, configureSession, ApiError, type AppData } from "./api";

// Empty data is never rendered as an authenticated profile before loading succeeds.
const empty: AppData = {
  user: {
    id: "", name: "", program: "", year: "", avatar: "", rating: 0, reviews: 0,
    verification: "verified", completedTransactions: 0, ridesGiven: 0, groupsHosted: 0,
  },
  listings: [], rides: [], groups: [], chats: [], reviews: [], activity: [],
};
interface AppContext {
  data: AppData;
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
  signedIn: boolean;
  restoring: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  mutate: (path: string, body?: unknown, method?: string) => Promise<{ id: string }>;
  contact: (id: string) => Promise<string>;
  thread: (id: string) => Promise<void>;
}
const Context = createContext<AppContext | null>(null);
const key = "loop.mobile.session";

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const generation = useRef(0);
  const loadVersion = useRef(0);

  const clear = useCallback(() => {
    generation.current++;
    configureSession(null);
    setSignedIn(false);
    setData(empty);
    setError("");
    void SecureStore.deleteItemAsync(key).catch(() => {});
  }, []);

  const reload = useCallback(async () => {
    const current = generation.current;
    const version = ++loadVersion.current;
    const active = () => current === generation.current && version === loadVersion.current;
    setError("");
    try {
      const result = await mobileApi.load();
      if (active()) {
        setData(previous => ({
          ...result,
          chats: result.chats.map(chat => ({
            ...chat,
            messages: previous.chats.find(item => item.id === chat.id)?.messages ?? [],
          })),
        }));
      }
    } catch (e) {
      if (active()) setError((e as Error).message);
    } finally {
      if (active()) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const saved = await SecureStore.getItemAsync(key);
        if (!active) return;
        if (saved) {
          configureSession(saved, clear);
          setSignedIn(true);
          await reload();
        }
      } catch {
        if (active) setError("Your saved session could not be restored. Please sign in again.");
      } finally {
        if (active) {
          setLoading(false);
          setRestoring(false);
        }
      }
    })();
    return () => { active = false; };
  }, [clear, reload]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", state => {
      if (state === "active" && signedIn) void reload();
    });
    return () => subscription.remove();
  }, [signedIn, reload]);

  const signIn = async (email: string, password: string) => {
    const session = await request<{ token: string }>("/api/auth/mobile", "POST", {
      email: email.trim().toLowerCase(), password,
    });
    try {
      await SecureStore.setItemAsync(key, session.token);
    } catch {
      // Never fall back to insecure storage; revoke the unused session where possible.
      configureSession(session.token);
      try { await request("/api/auth/mobile", "DELETE"); }
      catch {} // Network failure cannot justify storing an unprotected token.
      finally { configureSession(null); }
      throw new ApiError("Secure sign-in storage is unavailable. Please use Loop on an iOS or Android device and try again.");
    }
    generation.current++;
    configureSession(session.token, clear);
    setSignedIn(true);
    setLoading(true);
    await reload();
  };

  const logout = async () => {
    try { await request("/api/auth/mobile", "DELETE"); }
    finally { clear(); }
  };

  const mutate = async (path: string, body?: unknown, method = "POST") => {
    const result = await request<{ id: string }>(path, method, body);
    await reload();
    return result;
  };

  const contact = async (id: string) => {
    const result = await request<{ conversationId: string }>(
      `/api/marketplace/listings/${encodeURIComponent(id)}/contact`, "POST",
    );
    await reload();
    return result.conversationId;
  };

  const thread = useCallback(async (id: string) => {
    const current = generation.current;
    const messages = await mobileApi.thread(id);
    if (current === generation.current) {
      setData(previous => ({
        ...previous,
        chats: previous.chats.map(chat => chat.id === id ? { ...chat, messages, unread: 0 } : chat),
      }));
    }
  }, []);

  return (
    <Context.Provider value={{ data, loading, error, reload, signedIn, restoring, signIn, logout, mutate, contact, thread }}>
      {children}
    </Context.Provider>
  );
}
export function useLoop() {
  const value = useContext(Context);
  if (!value) throw new Error("Loop provider is required");
  return value;
}
