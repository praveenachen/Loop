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
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth credentials authentication

## Getting Started

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Fill in:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Generate Prisma client, run migrations, and seed the database:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

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
