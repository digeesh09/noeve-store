# Noeve — Work Tracker

Living document for project progress. Update this file at the end of each work session so the next session can resume quickly.

**Brand:** Noeve — ladies brand store (ornaments, jewellery, accessories, apparel, care products).  
**Stack:** pnpm monorepo · NestJS API · Next.js web-store & web-admin · Expo mobile-store & mobile-admin  
**Design spec:** [UI_DESIGN_LAYOUT.md](./UI_DESIGN_LAYOUT.md) · **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Overall progress (as of 2026-06-14)

| Phase | Scope | Status | Estimate |
|-------|--------|--------|----------|
| **MVP** | API + web-store + web-admin: catalog, cart, checkout, orders, manual fulfillment | **In progress** | ~65% |
| **Phase 2** | mobile-store polish, live payments, email notifications | **In progress** | ~25% |
| **Phase 3** | mobile-admin scanning, push tracking, promotions | **Not started** | ~5% |
| **Phase 4** | Search, analytics, multi-warehouse, loyalty | **Not started** | 0% |

**Where we stopped:** TypeScript errors fixed across the monorepo. Checkout flow works end-to-end on web-store (login → place order → admin status updates). Mobile checkout and payments still pending.

---

## Status legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done and usable |
| 🟡 | Partial — scaffolded, styled, or API-only |
| ⬜ | Not started |
| 🔄 | In progress / uncommitted changes |

---

## 1. API (`apps/api`)

| Item | Status | Notes |
|------|--------|-------|
| Auth (register, login store + admin) | ✅ | JWT; refresh token not implemented (duplicates access token) |
| Catalog (categories, products, admin create) | ✅ | Store + admin endpoints |
| Cart (guest session + user cart, CRUD) | ✅ | Stock checks in `cart.service.ts` |
| Orders (list, get, create, admin status PATCH) | ✅ | `POST /store/orders` creates from cart; merges guest session |
| Checkout (order placement) | ✅ | Via orders service; status `CONFIRMED` (no payment yet) |
| Payments / webhooks | ⬜ | |
| Fulfillment module (dedicated routes) | 🟡 | Logic embedded in orders service only |
| Users, addresses, inventory, promotions, notifications, analytics, jobs | ⬜ | |
| Prisma schema | 🟡 | User, Category, Product, Variant, Image, Cart, Order entities; no Address, Payment, Shipment |
| Seed data | ✅ | `admin@noeve.local` / `customer@noeve.local` + 12 sample products |
| Redis integration | ⬜ | In docker-compose; unused in code |

**Key endpoints live:** `/v1/store/categories`, `/store/products`, `/store/cart/*`, `/store/auth/*`, `POST /store/orders`, `/admin/auth/login`, `/admin/orders/*`

---

## 2. Web Store (`apps/web-store`) — `@noeve/web-store` :3000

| Item | Status | Notes |
|------|--------|-------|
| Purple & gold theme (ui-tokens, fonts) | ✅ | Cormorant + Inter, brand tokens in tailwind |
| Home (hero, collections, featured, trust badges) | ✅ | `page.tsx` + store components |
| Shop listing + category filter | ✅ | `/shop`, `/shop?category=` |
| Product detail + add to cart | ✅ | `/shop/[slug]` |
| Cart (live API, session header) | ✅ | `cart-provider`, `cart-view` |
| Site header / footer / nav | ✅ | |
| Account / login | ✅ | `AccountPanel` wired to `/store/auth/login` + register |
| Checkout page | ✅ | `/checkout` — place order (demo, no payment) |
| Order history | ✅ | Shown on account page after login |
| Wishlist | ⬜ | UI placeholder on PDP |
| Use `@noeve/api-client` | ⬜ | Hand-rolled `fetch` in `src/lib/api.ts`, `cart.ts` |

---

## 3. Web Admin (`apps/web-admin`) — `@noeve/web-admin` :3002

| Item | Status | Notes |
|------|--------|-------|
| Dashboard layout + sidebar nav | ✅ | Orders, Products, Fulfillment links |
| Login page | ✅ | Wired to `POST /admin/auth/login` |
| Auth guard (dashboard) | ✅ | Client-side redirect to `/login` |
| Orders list + status updates | ✅ | Table with fulfillment transition buttons |
| Products CRUD UI | ✅ | List + create implemented (`/dashboard/products`) |
| Fulfillment queue UI | ⬜ | Stub page |
| Inventory, customers, promotions, settings | ⬜ | Routes not created |
| Auth guard / JWT middleware | ⬜ | `middleware.ts` is HTTPS-only |

---

## 4. Mobile Store (`apps/mobile-store`) — Expo

| Item | Status | Notes |
|------|--------|-------|
| Tab bar (Home, Shop, Cart, Account) | ✅ | Purple/gold theme, cart badge |
| Home (hero, collections, featured) | ✅ | Live catalog API |
| Shop (category chips, grid) | ✅ | |
| Product detail | 🟡 | Rich PDP; metal/purity/chain selectors **UI-only**; add-to-cart uses first variant |
| Cart (live API) | ✅ | Checkout disabled — "coming soon" |
| Account / login | 🟡 | Styled stub |
| Checkout / orders | ⬜ | |

---

## 5. Mobile Admin (`apps/mobile-admin`) — Expo

| Item | Status | Notes |
|------|--------|-------|
| Expo Router shell | ✅ | |
| Orders / fulfill / scan screens | ⬜ | Placeholder copy only |
| API integration | ⬜ | |

---

## 6. Shared packages (`packages/`)

| Package | Status | Notes |
|---------|--------|-------|
| `@noeve/ui-tokens` | ✅ | Purple/gold brand tokens — used by web + mobile |
| `@noeve/shared-types` | 🟡 | User, Category, Product, Order; no cart DTOs |
| `@noeve/validation` | 🟡 | auth, catalog, cart, checkout, pagination schemas |
| `@noeve/api-client` | 🟡 | Auth + health only; catalog/cart paths declared but not implemented |
| `@noeve/config-typescript` | ✅ | |
| `@noeve/ui-web`, `@noeve/ui-native`, `@noeve/config-eslint` | ⬜ | Per architecture doc |

---

## 7. Infrastructure & docs

| Item | Status | Notes |
|------|--------|-------|
| Docker Compose (Postgres, Redis, MinIO) | ✅ | `infrastructure/docker/docker-compose.yml` |
| DB migrate + seed | ✅ | `pnpm db:migrate`, `pnpm db:seed` |
| Nginx HTTPS sample | ✅ | |
| CI workflows | ⬜ | `.github/workflows/` empty |
| `docs/ARCHITECTURE.md` | ✅ | |
| `docs/UI_DESIGN_LAYOUT.md` | ✅ | Mockups in `docs/images/` |
| `docs/WORK_TRACKER.md` | ✅ | This file |
| OpenAPI export | ⬜ | |

---

## Uncommitted work (git snapshot 2026-06-14)

Working tree is clean. All previous UI redesign and API changes have been committed and pushed.

---

## Recommended next steps (priority order)

### Critical path to MVP

1. ~~**Checkout + order creation (API)**~~ ✅ Done  
2. ~~**Wire customer auth (web-store)**~~ ✅ Done  
3. ~~**Web admin — orders & fulfillment**~~ ✅ Done  
4. ~~**Checkout UI (web-store)**~~ ✅ Done  
5. ~~**Web admin — products**~~ ✅ Done  
6. **Mobile store** — Wire auth, checkout, variant selection → cart API  
7. **Payments** (Stripe/Razorpay) + webhooks

### After MVP

6. Payments (Stripe/Razorpay) + webhooks  
7. Customer order history on web + mobile  
8. Expand `@noeve/api-client` and migrate clients off hand-rolled fetch  
9. Mobile variant selection → pass correct `variantId` to cart API  
10. Email notifications (order confirmed, shipped)  
11. mobile-admin fulfill flow + barcode scan  
12. CI pipeline (lint, typecheck, build per app)

---

## Dev credentials (seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@noeve.local` | `Admin123!` |
| Customer | `customer@noeve.local` | `Customer123!` |

---

## Session log

| Date | Focus | Completed | Next up |
|------|-------|-----------|---------|
| 2026-06-14 | Project analysis + work tracker | Analyzed README, ARCHITECTURE, UI_DESIGN_LAYOUT vs codebase; created `docs/WORK_TRACKER.md` | Commit UI redesign; start checkout API + wire admin orders |
| 2026-06-14 | Fix errors + checkout MVP | Fixed Prisma client + mobile/web TS errors; `POST /store/orders`; web-store auth/checkout; web-admin login + orders table | Admin products CRUD; mobile auth/checkout; payments |
| 2026-06-14 | Web admin products | Implemented Web Admin Products page with List and Create forms using API endpoints. Fixed layout typing error. | Mobile auth/checkout; payments |

---

## How to update this document

At the end of each session:

1. Move items from 🔄/⬜ to ✅ or 🟡 in the tables above.  
2. Adjust the **Overall progress** percentages.  
3. Add a row to **Session log** with date, what was done, and what to pick up next.  
4. Update **Uncommitted work** if git status changed significantly.  
5. Re-order **Recommended next steps** if priorities shifted.
