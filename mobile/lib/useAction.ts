import { useRef, useState } from "react";
export function useAction() {
 const lock = useRef(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState("");
 const run = async (work: () => Promise<unknown>, message = "") => {
   if (lock.current) return false;
   lock.current = true; setBusy(true); setError(""); setSuccess("");
   try { await work(); setSuccess(message); return true; } catch (e) { setError((e as Error).message); return false; }
   finally { lock.current = false; setBusy(false); }
 };
 return { busy, error, success, run };
}
