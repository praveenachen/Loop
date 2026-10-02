# Loop

Loop is a verified campus companion for University of Waterloo students. It brings rides, marketplace listings, study groups, and messages into one trusted student network so people can coordinate the everyday logistics of campus life without bouncing between scattered chats and listings.

## What It Does

- Find or post rides with seat status, routes, departure details, and driver trust signals.
- Browse marketplace listings for student-to-student buying and selling.
- Create and join study groups by course, schedule, location, and focus area.
- Keep conversations connected to the ride, listing, or group they started from.
- Use seeded beta accounts and QA tools to test the full flow quickly.

## Tech Stack

- Next.js 15 with App Router
- Expo SDK 55 / React Native mobile frontend in `mobile/`
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth credentials authentication

## Run Locally: Backend + Frontend

Use Node.js 22, npm, and Docker Desktop. For mobile, use Expo Go on a phone or the iPhone Simulator included with Xcode. The Next.js server runs both the backend API and web frontend; Expo runs the mobile frontend separately.

### 1. Start the database

Open Docker Desktop and wait for it to start. In your terminal, create a local PostgreSQL container once:

```bash
docker run --name loop-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=loop_local_password \
  -e POSTGRES_DB=loop \
  -p 127.0.0.1:55432:5432 \
  -v loop-postgres-data:/var/lib/postgresql/data \
  -d postgres:16-alpine
```

On later runs, start the existing container:

```bash
docker start loop-postgres
```

### 2. Configure the backend

From the repository root:

```bash
npm install
cp .env.example .env
```

Edit the root `.env`:

```dotenv
DATABASE_URL="postgresql://postgres:loop_local_password@localhost:55432/loop?schema=public"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="PASTE_A_GENERATED_SECRET_HERE"
```

Generate the secret and paste the output into `NEXTAUTH_SECRET`:

```bash
node -e 'console.log(require("node:crypto").randomBytes(32).toString("hex"))'
```

Prepare the new development database:

```bash
npm run prisma:generate
npm run prisma:deploy
npm run db:seed
```

**Seeding resets data. Run it only on your development database when you want fresh demo data.** Apply migrations again whenever new migrations are added; you do not need to seed on every startup.

### 3. Start the backend and web frontend — Terminal 1

From the repository root:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3001
```

Keep this terminal running. Open **http://localhost:3001** for the web frontend. Port 3001 is used throughout this guide to avoid conflicts with other apps on port 3000.

### 4. Configure the mobile frontend

In a second terminal, from the repository root:

```bash
cd mobile
npm install
cp .env.example .env
```

Set exactly one `EXPO_PUBLIC_API_BASE_URL` entry in `mobile/.env`. Use the backend origin without an `/api` suffix:

| Mobile runtime | `mobile/.env` value |
| --- | --- |
| iPhone Simulator on the backend Mac | `EXPO_PUBLIC_API_BASE_URL=http://localhost:3001` |
| Android emulator | `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3001` |
| Physical phone | `EXPO_PUBLIC_API_BASE_URL=http://YOUR_COMPUTER_LAN_IP:3001` |

For a physical phone, connect it to the same Wi-Fi as the computer. On macOS, find the Wi-Fi IP with `ipconfig getifaddr en0` and substitute the result for `YOUR_COMPUTER_LAN_IP`. If needed, allow the backend port through the computer's firewall.

Root `.env` contains private backend configuration. `mobile/.env` contains only the public API origin. Neither local environment file should be committed.

### 5. Start the mobile frontend — Terminal 2

From `mobile/`:

```bash
npm start -- --clear
```

- Press **i** to open the iPhone Simulator.
- Press **a** to open an Android emulator.
- On a physical phone, scan the QR code using Expo Go (or the iPhone Camera).

Keep both server terminals running and sign in using a demo account below. Restart Expo after changing `mobile/.env`.

### Subsequent startups

Start Docker Desktop, then:

```bash
# Terminal 1: repository root
docker start loop-postgres
npm run dev -- --hostname 0.0.0.0 --port 3001
```

```bash
# Terminal 2: repository root
cd mobile
npm start
```

Press **Control + C** in either server terminal to stop it. The named Docker volume preserves database records between container restarts.

### Troubleshooting and checks

- **`npm: command not found`:** ensure Node.js 22 is installed and its `bin` directory is on your terminal's `PATH`.
- **Port already in use:** use a free backend port and update both `NEXTAUTH_URL` and `EXPO_PUBLIC_API_BASE_URL` to match.
- **API configuration error:** check `mobile/.env` contains a single valid `EXPO_PUBLIC_API_BASE_URL=http://...` line, save it, and restart Expo with `npm start -- --clear`.
- **Phone cannot connect:** first open the backend's LAN URL in the phone's browser; check Wi-Fi, firewall, and that Terminal 1 is running.
- **Expo dependency errors:** run `npm ci` inside `mobile/` to restore the committed dependency versions.

```bash
# Repository root
npx tsc --noEmit
npm run build
npm --prefix mobile run typecheck
npm --prefix mobile test
```

See [mobile/README.md](mobile/README.md) for authentication, API architecture, integration tests, and remaining mobile limitations.

## Demo Accounts

Seeded login:

- Email: `avery@uwaterloo.ca`
- Password: `LoopPass123!`

Additional beta users:

- `beta1@uwaterloo.ca` / `LoopPass123!`
- `beta2@uwaterloo.ca` / `LoopPass123!`

## Useful Routes

- `/` - Student dashboard and activity overview
- `/rides` - Ride offers and ride requests
- `/marketplace` - Student marketplace listings
- `/study-groups` - Course study groups
- `/messages` - Conversation previews
- `/profile` - Current student profile
- `/beta-lab` - Create test marketplace, ride, and study records
- `/beta-admin` - Reset and reseed the beta database

## Scripts

- `npm run dev` - Start the local Next.js dev server
- `npm run build` - Build the production app
- `npm run start` - Start the production server
- `npm run prisma:generate` - Generate the Prisma client
- `npm run prisma:migrate` - Run local Prisma migrations
- `npm run prisma:deploy` - Apply migrations in deployed environments
- `npm run db:seed` - Seed beta data

## Project Notes

Mascot artwork lives in `public/geese`, and the UI is already wired to those asset paths. Backend setup details are also documented in `docs/BACKEND_SETUP.md`.
