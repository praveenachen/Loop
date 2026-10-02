# Loop mobile

The existing Expo UI is preserved. Core screens now use the same Next.js API and PostgreSQL domain records as the web app. No fixture or local mutation fallback remains.

## Run backend and mobile

Use Node 20.19+ (Node 22 recommended), PostgreSQL, and Expo Go or an Expo development build.

From the repository root:

```sh
npm install
cp .env.example .env
# Edit .env: DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET.
# Use your local development database; do not seed a production database.
npm run prisma:generate
npm run prisma:deploy
npm run db:seed
npm run dev -- --hostname 0.0.0.0 --port 3000
```

In a separate terminal:

```sh
cd mobile
npm install
cp .env.example .env
# Set EXPO_PUBLIC_API_BASE_URL to the reachable backend origin.
npm start
```

For an iOS simulator on the backend machine use `http://localhost:3000`. Android emulator uses `http://10.0.2.2:3000`. A physical device uses your computer's LAN address, such as `http://<LAN-address>:3000`, on the same network. Allow the backend port through your local firewall. Restart Expo after changing its environment. No machine address is embedded in screens.

Seeded local accounts include `avery@uwaterloo.ca`, `beta1@uwaterloo.ca`, and `beta2@uwaterloo.ca`, with password `LoopPass123!`. These are existing development accounts; the app does not special-case them.

For production, set `EXPO_PUBLIC_API_BASE_URL=https://<deployed-loop-domain>` in the Expo build environment and apply backend migrations before releasing. Release builds reject HTTP API origins. Only the backend has DB credentials and NextAuth secrets; Expo public environment values must contain no secrets.

## API and session architecture

`lib/api.ts` is the sole fetch boundary: configured origin, typed JSON requests, bearer headers, 20-second timeout, safe errors, and session invalidation on HTTP 401. `lib/AppProvider.tsx` loads shared data, restores sessions, refreshes after mutations and on foreground, and clears data on logout. Existing screen frames refresh on focus and support pull-to-refresh. No state-management framework was added.

Mobile signs in through `POST /api/auth/mobile`, which reuses the exact credential checker used by NextAuth. The backend creates a random 256-bit opaque token, stores only its SHA-256 hash in `MobileSession`, and expires it after 30 days. Expo SecureStore holds the token on iOS/Android; passwords remain only in the sign-in form and are cleared on success. Navigation waits for restore and uses protected Stack routes for the authenticated shell. A 401 removes the local token and returns to Sign In. `DELETE /api/auth/mobile` revokes the server session on logout.

Web NextAuth cookie sessions continue to work. The shared server auth helper checks bearer tokens when supplied, otherwise NextAuth. Page middleware still protects web pages; API routes perform their own auth checks and return JSON 401 responses rather than redirecting mobile to HTML.

## Persistent features and routes

| Feature | Backend |
| --- | --- |
| Home/current user | `GET /api/dashboard`, current-user activity derived from fetched owned/joined/requested records |
| Marketplace | `GET/POST /api/marketplace/listings`, `POST /api/marketplace/listings/:id/contact` |
| Ride offer/request/seat request | `GET/POST /api/rides`, `POST /api/rides/:id/request-seat` |
| Study creation/membership | `GET/POST /api/study-groups`, `POST /api/study-groups/:id/join` |
| Inbox | `GET /api/messages/previews` |
| Conversation | `GET/POST /api/messages/:id` |
| Profile/reviews/edit | `GET/PATCH /api/profile/me`, `GET /api/users/me` |
| Search | `GET /api/search?q=...`, debounced on mobile |

New routes are mobile auth, thread messages, and search. Message previews include additive context fields. Dashboard activity is scoped to the current user. Existing create/join/request/contact/profile validation and transaction rules are reused. Mutations derive identity on the server, ignore arbitrary user-ID fields, prevent duplicate submits on mobile, and refresh data. Existing feedback, loading, error, and empty components provide functional states without changing the design system.

## Validation

```sh
# Root
npx tsc --noEmit
npm run build
# Mobile
npm --prefix mobile run typecheck
npm --prefix mobile test
cd mobile
npx expo export --platform ios --output-dir /tmp/loop-mobile-ios-export
```

`npm --prefix mobile test` runs 11 API and session-provider tests. SecureStore and AppState are mocked for provider lifecycle checks (restore, sign-in, logout, expired tokens, storage failure, foreground refresh); this does not substitute for native keychain testing.

`tests/mobile-integration.mjs` exercises real routes against a **separate migrated and seeded test database**. It creates test records, tests two-party messages and a third-party access denial, rejects forged identity, checks duplicate joins/seat requests, profile edits, search, session reuse, and logout. Start a backend using that isolated database, then:

```sh
TEST_API_BASE_URL=http://127.0.0.1:3097 node tests/mobile-integration.mjs
```

On an iOS/Android device, verify sign-in, closing/reopening the app, logout, protected navigation/deep links, pull-to-refresh, loading/error/retry feedback, and form submissions. Set `TEST_DATABASE_URL` to that same isolated database URL to also test token hashing and server-side expiry. Device SecureStore behavior requires a native runtime; Expo web is a layout preview, with no insecure browser-storage fallback.

## Scope and limitations

- Threads poll every 15 seconds while open and fetch the latest 200 messages. Realtime and older-message pagination are deferred.
- Search reuses domain serializers and filters server-side; database indexing/pagination can be added as datasets grow.
- Offline access is not cached. If logout cannot reach the server, local state is cleared and the unreachable server token expires naturally; online logout revokes it immediately.
- Sessions expire after 30 days and require sign-in again; token rotation/refresh is deferred. Schedule expired `MobileSession` cleanup operationally.
- Apply authentication rate limiting at the deployed API gateway/reverse proxy, as for the existing NextAuth credentials endpoint.
- No payments, booking approvals, verification enrollment, or unrelated features were added.
