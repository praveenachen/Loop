# Backend Setup

## Stack
- Next.js Route Handlers
- PostgreSQL
- Prisma ORM
- NextAuth (credentials auth)
- Zod validation

## 1. Environment
Copy `.env.example` to `.env` and fill values:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## 2. Initialize DB
```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run db:seed
```

## 3. Run app
```bash
npm run dev
```

## 4. Seed login
- Email: `avery@uwaterloo.ca`
- Password: `LoopPass123!`

Additional beta users:
- `beta1@uwaterloo.ca` / `LoopPass123!`
- `beta2@uwaterloo.ca` / `LoopPass123!`

## 5. Implemented APIs
- `GET /api/users/me`
- `GET/POST /api/marketplace/listings`
- `GET/POST /api/rides`
- `GET/POST /api/study-groups`
- `GET /api/messages/previews`
- `GET /api/profile/me`
- `GET/POST /api/auth/[...nextauth]`

All APIs are auth-protected via NextAuth middleware except sign-in route.

## 6. Beta usability test flow
1. Start app and open `/auth/sign-in`
2. Log in as `beta1@uwaterloo.ca`
3. Open `/beta-lab` and click:
   - `Create Marketplace Listing`
   - `Create Ride Listing`
   - `Create Study Group`
4. Verify generated data appears in:
   - `/marketplace`
   - `/rides`
   - `/study-groups`
5. Open `/auth/sign-in`, log in as `beta2@uwaterloo.ca`, and repeat to validate multi-user behavior.

## 7. QA helper tools
- `/beta-lab`: create new marketplace/ride/study records from UI.
- `/beta-admin`: one-click reset + reseed database.
- Top nav `Log out` button: switch between beta users quickly.
