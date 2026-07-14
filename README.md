# GMS Catalog

Monorepo with:

- `apps/api`: GraphQL API with Express, Apollo Server, TypeGraphQL, Prisma, and SQLite.
- `apps/web`: React + Vite frontend with Tailwind, React Query, and Apollo Client.

## Scripts

- `pnpm dev`: run API and frontend together through Turborepo.
- `pnpm build`: typecheck the API and build the frontend.
- `pnpm test`: run the API test suite.
- `pnpm db:generate`: generate the Prisma client.
- `pnpm db:migrate`: run Prisma migrations.
- `pnpm db:studio`: open Prisma Studio.

## Local setup

1. Copy `.env.example` to `.env` if needed.
2. Run `pnpm install`.
3. Run `pnpm db:generate`.
4. Run `pnpm dev`.

The API runs on `http://localhost:4000/graphql`.
The frontend runs on `http://localhost:5173`.

## Auth flow

- New registrations create `USER` accounts.
- A seeded admin account is created automatically:
  - email: `admin@gms-catalog.com`
  - password: `Admin123!`

## Frontend behavior

- Admin users land on the catalog dashboard with add, edit, delete, list, and grid views.
- Normal users land on the played games page with a two-step modal to add a new played game.
- Normal users also have an all-games tab with title, developer, genre, sort, and order filters.
