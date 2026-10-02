import type { Activity, Conversation, MarketplaceListing, Review, RideListing, StudyGroup, User, Message } from './types';
export interface AppData { user: User; listings: MarketplaceListing[]; rides: RideListing[]; groups: StudyGroup[]; chats: Conversation[]; reviews: Review[]; activity: Activity[] }
export class ApiError extends Error { constructor(message: string, public status = 0) { super(message); } }
let token: string | null = null;
let expired: (() => void) | undefined;
export function configureSession(value: string | null, onExpired?: () => void) { token = value; expired = onExpired; }
export async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, '');
  if (!base || !/^https?:\/\//.test(base)) throw new ApiError('Configure EXPO_PUBLIC_API_BASE_URL to connect to Loop.');
  if (!__DEV__ && !base.startsWith('https://')) throw new ApiError('Loop requires a secure HTTPS connection.');
  const requestToken = token;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${base}${path}`, { method, signal: controller.signal, headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}), ...(requestToken ? { Authorization: `Bearer ${requestToken}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 401 && requestToken && token === requestToken) expired?.();
      throw new ApiError(response.status >= 500 ? 'Loop is temporarily unavailable. Please try again.' : (typeof payload?.error === 'string' ? payload.error : 'This request could not be completed.'), response.status);
    }
    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Could not connect to Loop. Check your connection and try again.');
  } finally { clearTimeout(timeout); }
}
export const mobileApi = {
  async load(): Promise<AppData> {
    const [profile, listings, rides, groups, chats, dashboard] = await Promise.all([
      request<{ user: User; reviews: Review[] }>('/api/profile/me'), request<MarketplaceListing[]>('/api/marketplace/listings'), request<RideListing[]>('/api/rides'), request<StudyGroup[]>('/api/study-groups'), request<Conversation[]>('/api/messages/previews'), request<{ user: User }>('/api/dashboard')
    ]);
    const activity: Activity[] = [
      ...listings.filter(l => l.isOwner).map(l => ({ id: l.id, entityId: l.id, vertical: 'marketplace' as const, title: l.title, detail: `${l.category} · ${l.location}` })),
      ...rides.filter(r => r.isOwner || r.requestedByCurrentUser).map(r => ({ id: r.id, entityId: r.id, vertical: 'rides' as const, title: r.route, detail: r.departure })),
      ...groups.filter(g => g.isOwner || g.joinedByCurrentUser).map(g => ({ id: g.id, entityId: g.id, vertical: 'study' as const, title: `${g.course}: ${g.title}`, detail: g.schedule }))
    ];
    return { ...profile, user: dashboard.user, listings, rides, groups, chats, activity };
  },
  thread: (id: string) => request<Message[]>(`/api/messages/${encodeURIComponent(id)}`)
};
