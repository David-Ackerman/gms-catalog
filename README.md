# GMS Catalog

Game catalog monorepo with:

- `apps/api`: GraphQL API using Express, Apollo Server, TypeGraphQL, Prisma, and SQLite.
- `apps/web`: React + Vite frontend using React Query, Apollo Client, Tailwind CSS, and Radix UI primitives.

## Stack

- Package manager: `pnpm`
- Workspace runner: `turbo`
- Database: SQLite
- API transport: GraphQL at `http://localhost:4000/graphql`
- Frontend: `http://localhost:5173`

## Project Structure

```text
.
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   ├── src/
│   │   │   ├── dtos/
│   │   │   ├── models/
│   │   │   ├── resolvers/
│   │   │   ├── services/
│   │   │   ├── seed.ts
│   │   │   └── index.ts
│   └── web/
│       └── src/
│           ├── components/
│           ├── lib/
│           └── pages/
├── package.json
└── README.md
```

## Requirements

- Node.js 20+ recommended
- `pnpm` 10.x

## Environment

Create a root `.env` file if it does not exist.

Minimum required variable:

```env
JWT_SECRET=change-me
```

Optional database override:

```env
DATABASE_URL=file:./dev.db
```

If `DATABASE_URL` is omitted, the API defaults to `apps/api/prisma/dev.db`.

## Install

```bash
pnpm install
```

## First Run

Run these in order:

1. Generate Prisma client

```bash
pnpm db:generate
```

2. Apply migrations

```bash
pnpm db:migrate
```

3. Seed the database

```bash
pnpm db:seed
```

4. Start the project

```bash
pnpm dev
```

If you want to run each app separately:

```bash
pnpm dev:api
pnpm dev:web
```

## Database and Seed

Useful commands:

- `pnpm db:generate`: generate Prisma client
- `pnpm db:migrate`: apply Prisma migrations
- `pnpm db:seed`: destructive reseed
- `pnpm db:studio`: open Prisma Studio

Important seed behavior:

- `pnpm db:seed` deletes all `playedGame`, `game`, and `user` rows, then recreates seed data.
- API startup also calls the safe seed path, but it only inserts initial data when the catalog is empty.

Seeded admin account:

- Email: `admin@gms-catalog.com`
- Password: `Admin123!`

## Main Scripts

Root scripts:

- `pnpm dev`: run API and frontend together
- `pnpm build`: typecheck/build the workspace
- `pnpm test`: run tests
- `pnpm dev:api`: run only the API
- `pnpm dev:web`: run only the frontend
- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm db:studio`

API-only scripts:

- `pnpm --filter @gms-catalog/api dev`
- `pnpm --filter @gms-catalog/api build`
- `pnpm --filter @gms-catalog/api seed`
- `pnpm --filter @gms-catalog/api test`

Frontend-only scripts:

- `pnpm --filter @gms-catalog/web dev`
- `pnpm --filter @gms-catalog/web build`

## How the App Is Intended to Be Used

### Admin flow

- Login with the seeded admin account.
- Manage games from the admin dashboard.
- Create, edit, deactivate, and delete catalog entries.
- Switch between grid and list views.

### User flow

- Register a normal account or login with an existing user.
- Browse the catalog from `All games`.
- Open a game details page.
- Mark a game as played from the details page.
- Add a status, personal score, review note, and notes.
- Manage played entries from `My library`.

## Caching Behavior

The frontend uses React Query for read caching.

- Game lists are cached for 15 minutes.
- Game details are cached for 15 minutes.
- Played games are cached for 15 minutes.
- These caches are invalidated after successful mutations.

That means reads should not refetch immediately on each navigation unless:

- 15 minutes have passed, or
- a mutation changed related data

## Key Files to Edit

### Frontend

- `apps/web/src/app.tsx`
  Route setup.

- `apps/web/src/pages/admin-dashboard.tsx`
  Admin entry point, game management flow.

- `apps/web/src/pages/user-dashboard.tsx`
  User library and catalog flow.

- `apps/web/src/pages/game-details-page.tsx`
  Game details page, played-game entry flow.

- `apps/web/src/components/game-browser.tsx`
  Shared catalog list/grid UI.

- `apps/web/src/components/game-form-modal.tsx`
  Admin create/edit game modal.

- `apps/web/src/components/played-game-modal.tsx`
  User played-game create/edit modal.

- `apps/web/src/components/game-presenters.tsx`
  Platform icons, genre badges, score presentation.

- `apps/web/src/components/app-shell.tsx`
  Shared app header and user dropdown.

- `apps/web/src/components/ui.tsx`
  Shared UI primitives such as `Button`, `Input`, `Modal`, `Select`, `Panel`.

- `apps/web/src/lib/api.ts`
  GraphQL client operations and mutation payload normalization.

- `apps/web/src/lib/auth.tsx`
  Session handling and current-user state.

### Backend

- `apps/api/src/index.ts`
  API bootstrap, schema creation, server startup.

- `apps/api/src/resolvers/*.ts`
  GraphQL query and mutation entry points.

- `apps/api/src/services/*.ts`
  Business logic for games, auth, users, and played games.

- `apps/api/src/dtos/input/*.ts`
  GraphQL input shapes.

- `apps/api/src/models/*.ts`
  GraphQL object models.

- `apps/api/src/seed.ts`
  Seed data and reset/reseed behavior.

- `apps/api/prisma/schema.prisma`
  Database schema.

- `apps/api/schema.graphql`
  Generated GraphQL schema reference.

## API Endpoint

GraphQL endpoint:

```text
POST http://localhost:4000/graphql
```

Recommended headers:

```http
Content-Type: application/json
Authorization: Bearer <token>
```

Use `Authorization` only for authenticated queries/mutations.

## Core GraphQL Operations

### Public auth

- `login`
- `register`

### Authenticated queries

- `me`
- `listGames`
- `game`
- `myPlayedGames`

### Admin mutations

- `createGame`
- `updateGame`
- `deleteGame`

### User played-game mutations

- `createPlayedGame`
- `updatePlayedGame`
- `deletePlayedGame`

## Basic Input Schemas

### `CreateGameInput`

```graphql
input CreateGameInput {
  title: String!
  slug: String!
  description: String!
  synopsis: String
  developer: String
  publisher: String
  releaseDate: DateTimeISO
  genres: String
  platforms: String
  coverUrl: String
  isActive: Boolean
}
```

### `UpdateGameInput`

```graphql
input UpdateGameInput {
  title: String
  slug: String
  description: String
  synopsis: String
  developer: String
  publisher: String
  releaseDate: DateTimeISO
  genres: String
  platforms: String
  coverUrl: String
  isActive: Boolean
}
```

### `CreatePlayedGameInput`

```graphql
input CreatePlayedGameInput {
  status: String
  personalScore: Float
  reviewNote: String
  notes: String
}
```

### `UpdatePlayedGameInput`

```graphql
input UpdatePlayedGameInput {
  status: String
  personalScore: Float
  reviewNote: String
  notes: String
}
```

### `GameListFilterInput`

```graphql
input GameListFilterInput {
  title: String
  developer: String
  genres: String
  sortBy: String
  order: String
  isActive: Boolean
  includeInactive: Boolean
}
```

## Postman Examples

All examples below use:

```text
POST http://localhost:4000/graphql
Content-Type: application/json
```

### 1. Register user

```json
{
  "query": "mutation Register($data: RegisterInput!) { register(data: $data) { token refreshToken user { id name email role } } }",
  "variables": {
    "data": {
      "name": "Test User",
      "email": "user@example.com",
      "password": "Password123!"
    }
  }
}
```

### 2. Login

```json
{
  "query": "mutation Login($data: LoginInput!) { login(data: $data) { token refreshToken user { id name email role } } }",
  "variables": {
    "data": {
      "email": "admin@gms-catalog.com",
      "password": "Admin123!"
    }
  }
}
```

Copy the returned `token` and use it as:

```http
Authorization: Bearer <token>
```

### 3. Get current user

```json
{
  "query": "query Me { me { id name email role } }"
}
```

### 4. List games

```json
{
  "query": "query ListGames($filters: GameListFilterInput) { listGames(filters: $filters) { id title slug developer genres platforms averageScore playedCount reviewCount isActive } }",
  "variables": {
    "filters": {
      "title": "Hades",
      "sortBy": "createdAt",
      "order": "desc"
    }
  }
}
```

### 5. Get one game by id

```json
{
  "query": "query Game($id: String!) { game(id: $id) { id title slug description synopsis developer publisher releaseDate genres platforms coverUrl averageScore playedCount reviewCount isActive } }",
  "variables": {
    "id": "GAME_ID_HERE"
  }
}
```

### 6. Create game as admin

Note: `releaseDate` must be a full ISO datetime string.

```json
{
  "query": "mutation CreateGame($data: CreateGameInput!) { createGame(data: $data) { id title slug releaseDate } }",
  "variables": {
    "data": {
      "title": "Inside",
      "slug": "inside",
      "description": "Atmospheric puzzle-platformer.",
      "synopsis": "A short dark adventure.",
      "developer": "Playdead",
      "publisher": "Playdead",
      "releaseDate": "2016-06-29T00:00:00.000Z",
      "genres": "Puzzle, Adventure",
      "platforms": "PC, PlayStation, Xbox, Switch",
      "coverUrl": "https://example.com/inside.jpg",
      "isActive": true
    }
  }
}
```

### 7. Update game as admin

```json
{
  "query": "mutation UpdateGame($id: String!, $data: UpdateGameInput!) { updateGame(id: $id, data: $data) { id title isActive releaseDate } }",
  "variables": {
    "id": "GAME_ID_HERE",
    "data": {
      "title": "Inside Remastered",
      "releaseDate": "2016-06-29T00:00:00.000Z",
      "isActive": true
    }
  }
}
```

### 8. Delete game as admin

```json
{
  "query": "mutation DeleteGame($id: String!) { deleteGame(id: $id) }",
  "variables": {
    "id": "GAME_ID_HERE"
  }
}
```

### 9. Create played-game entry

```json
{
  "query": "mutation CreatePlayedGame($gameId: String!, $data: CreatePlayedGameInput) { createPlayedGame(gameId: $gameId, data: $data) { id gameId status personalScore reviewNote notes } }",
  "variables": {
    "gameId": "GAME_ID_HERE",
    "data": {
      "status": "PLAYED",
      "personalScore": 92,
      "reviewNote": "Excellent pacing and level design.",
      "notes": "Would replay."
    }
  }
}
```

### 10. Update played-game entry

```json
{
  "query": "mutation UpdatePlayedGame($id: String!, $data: UpdatePlayedGameInput!) { updatePlayedGame(id: $id, data: $data) { id status personalScore reviewNote notes } }",
  "variables": {
    "id": "PLAYED_GAME_ID_HERE",
    "data": {
      "status": "PLAYED",
      "personalScore": 95,
      "reviewNote": "Upgraded score after second run.",
      "notes": "Still great."
    }
  }
}
```

### 11. Delete played-game entry

```json
{
  "query": "mutation DeletePlayedGame($id: String!) { deletePlayedGame(id: $id) }",
  "variables": {
    "id": "PLAYED_GAME_ID_HERE"
  }
}
```

### 12. Get my played games

```json
{
  "query": "query MyPlayedGames { myPlayedGames { id gameId status personalScore reviewNote notes createdAt game { id title developer coverUrl } } }"
}
```

## Notes and Constraints

- `releaseDate` must be sent as ISO datetime in direct GraphQL requests, for example:
  `2023-08-03T00:00:00.000Z`
- `personalScore` is normalized to the `0..100` range on the backend.
- The frontend converts date input values like `2026-07-14` into ISO datetime before sending mutations.
- `pnpm db:seed` is destructive by design.

## Validation / Quick Checks

Useful checks after changes:

```bash
pnpm build
pnpm test
```

Or individually:

```bash
pnpm --filter @gms-catalog/api build
pnpm --filter @gms-catalog/web build
pnpm --filter @gms-catalog/api test
```
