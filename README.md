# Noeve

Monorepo for the Noeve brand store: customer web/mobile, admin web/mobile, and a central API.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 9+
- Docker (for local Postgres, Redis, MinIO)

## Quick start

```bash
# Install dependencies
pnpm install

# Start infrastructure
docker compose -f infrastructure/docker/docker-compose.yml up -d

# Default host ports (avoid conflicts with local services):
#   Postgres 5433  (system Postgres often uses 5432)
#   Redis    6380  (system Redis often uses 6379)
# Override: NOEVE_POSTGRES_PORT=5432 NOEVE_REDIS_PORT=6379 docker compose ...

# Configure API
cp .env.example apps/api/.env

# Database
pnpm db:generate
pnpm db:migrate

# Run all apps (or individually)
pnpm dev
```

## Apps

| App | Package | Dev URL | Description |
|-----|---------|---------|-------------|
| API | `@noeve/api` | http://localhost:3001 | NestJS backend |
| Web store | `@noeve/web-store` | http://localhost:3000 | Customer storefront |
| Web admin | `@noeve/web-admin` | http://localhost:3002 | Admin dashboard |
| Mobile store | `@noeve/mobile-store` | Expo dev tools | Customer mobile |
| Mobile admin | `@noeve/mobile-admin` | Expo dev tools | Fulfillment mobile |

## Scripts

```bash
pnpm dev              # All apps in parallel
pnpm dev:api          # API only
pnpm dev:web-store    # Storefront only
pnpm build            # Production build
pnpm lint             # Lint all packages
pnpm typecheck        # Typecheck all packages
```

## Documentation

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for system design and folder layout.
