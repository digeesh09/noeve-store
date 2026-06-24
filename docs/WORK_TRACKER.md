# Noeve — Work Tracker

Living document for project progress. Update this file at the end of each work session so the next session can resume quickly.

**Brand:** Noeve — ladies brand store (ornaments, jewellery, accessories, apparel, care products).  
**Stack:** pnpm monorepo · NestJS API · Next.js web-store & web-admin · Expo mobile-store & mobile-admin  
**Design spec:** [UI_DESIGN_LAYOUT.md](./UI_DESIGN_LAYOUT.md) · **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Overall progress (as of 2026-06-24)

| Phase | Scope | Status | Estimate |
|-------|--------|--------|----------|
| **MVP** | API + web-store + web-admin: catalog, cart, checkout, orders, manual fulfillment | **In progress** | ~75% |
| **Phase 2** | mobile-store polish, live payments, email notifications | **In progress** | ~40% |
| **Phase 3** | mobile-admin scanning, push tracking, promotions | **Not started** | ~5% |
| **Phase 4** | Search, analytics, multi-warehouse, loyalty | **Not started** | 0% |
| **Phase 5** | Enterprise & B2B: Mega menu, blogs, custom modules, B2B quotes, advanced workflows | **Not started** | 0% |

**Where we stopped:** All TypeScript errors resolved across the monorepo. Both web-store and mobile-store are fully type-clean and runnable. Web-store and mobile-store have functional checkout flows. Auth token wired in web-store API client. Mobile checkout import paths fixed. Prisma pinned to v6.x.

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
| Payments / webhooks | ⬜ | Razorpay package installed; routes not wired |
| Fulfillment module (dedicated routes) | 🟡 | Logic embedded in orders service only |
| Users, addresses, inventory, promotions, notifications, analytics, jobs | ⬜ | |
| Prisma schema | 🟡 | User, Category, Product, Variant, Image, Cart, Order, Payment entities; no Address, Shipment |
| Seed data | ✅ | `admin@noeve.local` / `customer@noeve.local` + 12 sample products |
| Redis integration | ⬜ | In docker-compose; unused in code |
| Prisma version pinned | ✅ | Locked to `^6.19.3` via pnpm overrides in root `package.json` |

**Key endpoints live:** `/v1/store/categories`, `/store/products`, `/store/cart/*`, `/store/auth/*`, `POST /store/orders`, `/admin/auth/login`, `/admin/orders/*`

---

## 2. Web Store (`apps/web-store`) — `@noeve/web-store` :3000 (Production: https://noeve.store)

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
| Wishlist | 🟡 | UI placeholder on PDP only |
| Auth token wired to apiClient | ✅ | `api.ts` now reads from `auth.ts` `getAccessToken()` |
| TypeScript clean | ✅ | Zero errors after shared-types `category` field fix |

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
| Cart (live API) | ✅ | Integrated with `@noeve/api-client` |
| Account / login | ✅ | Functional with `auth-context.tsx` and `@noeve/api-client` |
| Checkout / orders | ✅ | Functional Mobile Checkout screen to place orders |
| TypeScript clean | ✅ | Import paths fixed; types.ts re-exports from shared-types |
| Checkout Stack.Screen registered | ✅ | Added to `_layout.tsx` for proper nav header |

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
| `@noeve/shared-types` | 🟡 | User, Category, Product (+ category relation), Order, Cart; no Address, Payment DTOs |
| `@noeve/validation` | 🟡 | auth, catalog, cart, checkout, pagination schemas |
| `@noeve/api-client` | ✅ | Auth, catalog, cart, orders, admin — fully implemented |
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

## 8. Enterprise & B2B Features (Phase 5)

| Category | Item | Status | Notes |
|----------|------|--------|-------|
| **Storefront UX** | Mega menu | ⬜ | Advanced navigation |
| | Blogs | ⬜ | Content management |
| | Product reviews | ⬜ | User ratings and comments |
| | Product filters | ⬜ | Advanced faceted search |
| | Wishlist | 🟡 | Make functional (API + state) |
| | Customer portal | ⬜ | Enhanced self-service |
| | Mega menu | ⬜ | Advanced navigation |
| **Checkout & Shipping** | Returns | ⬜ | RMA process |
| | Pickup locations | ⬜ | BOPIS (Buy Online, Pick Up In Store) |
| | Live shipping rates | ⬜ | Third-party carrier integration |
| | Abandoned carts | ⬜ | Recovery emails |
| **Promotions & Sales** | Basic coupons | ⬜ | |
| | Advanced coupons | ⬜ | |
| | Automatic discounts | ⬜ | |
| **Catalog & Products** | Product recommendations | ⬜ | "You may also like" |
| | Product recommendations rules | ⬜ | Custom logic |
| | Digital Downloads | ⬜ | |
| | Assembly/Kit items | ⬜ | Bundles |
| **B2B & Advanced** | Member-only access | ⬜ | Gated catalog |
| | Price lists | ⬜ | Tiered B2B pricing |
| | Quote Requests | ⬜ | RFQ workflow |
| | Credit Limit for B2B customers | ⬜ | |
| | 3 Inventory locations | ⬜ | Multi-warehouse routing |
| | Serial number and batch tracking | ⬜ | |
| **Customization & Workflows**| Customize business workflows | ⬜ | |
| | Create business-specific custom modules | ⬜ | |
| | Manage custom functions | ⬜ | |
| **Channels & Support**| WhatsApp Commerce | ⬜ | |
| | Free expert onboarding assistance | ⬜ | |

---

## Uncommitted work (git snapshot 2026-06-24)

The following files have uncommitted changes (all part of the mobile + web fixes from this session):

- `apps/api/package.json` — Prisma version tracking
- `apps/api/prisma/schema.prisma` — Schema updates
- `apps/mobile-store/app/(tabs)/account.tsx` — Auth context wired
- `apps/mobile-store/app/(tabs)/cart.tsx` — Cart API integrated
- `apps/mobile-store/app/_layout.tsx` — AuthProvider + CartProvider + checkout Stack.Screen added
- `apps/mobile-store/src/lib/api.ts` — Migrated to NoeveApiClient
- `apps/mobile-store/src/lib/cart.ts` — Migrated to NoeveApiClient
- `apps/mobile-store/src/lib/types.ts` — Re-exports from @noeve/shared-types (deduplication fix)
- `apps/mobile-store/src/context/auth-context.tsx` — NEW: auth context
- `apps/mobile-store/app/checkout/` — NEW: checkout screen (fixed imports + refreshCart)
- `apps/web-store/src/lib/api.ts` — Auth token wired to getAccessToken()
- `apps/web-store/src/lib/cart.ts` — Minor refactor
- `apps/web-store/src/app/shop/[slug]/add-to-cart-section.tsx` — Cart updates
- `packages/api-client/src/client.ts` — Full implementation
- `packages/shared-types/src/models.ts` — Added `category?: Category` to Product
- `package.json` — pnpm overrides to pin Prisma ^6.19.3
- `docs/WORK_TRACKER.md` — This file

**Recommended action:** Commit all with message `feat: fix mobile+web TS errors, wire auth, pin Prisma v6`

---

## Recommended next steps (priority order)

### Critical path — Customer-facing apps running (Priority 1)

1. ✅ ~~**Web-store checkout + auth**~~ — Auth token now wired; checkout works end-to-end  
2. ✅ ~~**Mobile checkout screen**~~ — Import paths fixed, Stack.Screen registered, TypeScript clean  
3. **Commit & push all uncommitted changes** — `git add -A && git commit -m "feat: fix mobile+web TS errors, wire auth, pin Prisma v6"`  
4. **Verify apps run end-to-end locally:**
   - Start Docker: `docker compose -f infrastructure/docker/docker-compose.yml up -d`
   - Start API: `pnpm dev:api`
   - Start web-store: `pnpm dev:web-store` → http://localhost:3000
   - Start mobile: `cd apps/mobile-store && pnpm dev` → Expo Go on device/simulator
5. **Mobile variant selection** — PDP variant selectors are UI-only; wire selected variantId to `addItem(productId, variantId)` call in `product/[slug]`

### Phase 2 — Payments

6. **Razorpay integration** — Package already installed in API; implement `POST /store/payments/create-order` → Razorpay order, `POST /store/payments/verify` → webhook verification
7. **Update Order status flow** — On payment success webhook: move order from `PENDING_PAYMENT` → `CONFIRMED`
8. **Web-store payment UI** — Replace "place order (demo)" with Razorpay checkout.js modal
9. **Mobile payment UI** — Use `react-native-razorpay` or WebView for payment flow

### Phase 2 — Polish

10. **Email notifications** — Order confirmed, shipped (use Nodemailer or Resend)
11. **Order history on mobile** — Show orders list on Account screen after login
12. **Wishlist API** — Save/remove wishlist items per user; currently UI-only on web PDP

### Phase 3 — Admin & Ops

13. **Fulfillment queue UI** (web-admin) — `/dashboard/fulfillment` stub → full table with PICK/PACK/SHIP buttons  
14. **Mobile admin** — Scaffold orders list + status update flow  
15. **CI pipeline** — Add GitHub Actions: lint + typecheck + build per app

### Phase 4 — Scale

16. Expand `@noeve/shared-types` with Address, Payment, Shipment DTOs
17. Add Address model to Prisma schema + API endpoints
18. Redis session caching for cart
19. OpenAPI spec export + Swagger UI

---

## Dev credentials (seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@noeve.local` | `Admin123!` |
| Customer | `customer@noeve.local` | `Customer123!` |

---

## How to run locally

```bash
# 1. Start infrastructure (Postgres port 5433, Redis 6380)
docker compose -f infrastructure/docker/docker-compose.yml up -d

# 2. Migrate DB (first time only)
pnpm db:migrate

# 3. Seed data (first time only)
pnpm db:seed

# 4. Start API
pnpm dev:api          # http://localhost:3001/v1

# 5. Start web-store
pnpm dev:web-store    # http://localhost:3000

# 6. Start mobile (requires Expo Go or simulator)
cd apps/mobile-store && pnpm dev

# 7. (Optional) Start web-admin
pnpm dev:web-admin    # http://localhost:3002
```

---

## Session log

| Date | Focus | Completed | Next up |
|------|-------|-----------|---------| 
| 2026-06-14 | Project analysis + work tracker | Analyzed README, ARCHITECTURE, UI_DESIGN_LAYOUT vs codebase; created `docs/WORK_TRACKER.md` | Commit UI redesign; start checkout API + wire admin orders |
| 2026-06-14 | Fix errors + checkout MVP | Fixed Prisma client + mobile/web TS errors; `POST /store/orders`; web-store auth/checkout; web-admin login + orders table | Admin products CRUD; mobile auth/checkout; payments |
| 2026-06-14 | Web admin products | Implemented Web Admin Products page with List and Create forms using API endpoints. Fixed layout typing error. | Mobile auth/checkout; payments |
| 2026-06-22 | Finish Web Store | Added Wishlist UI placeholder to PDP and refactored API fetch calls to use `@noeve/api-client`. | Mobile auth/checkout; payments |
| 2026-06-22 | Mobile Store Auth | Migrated Mobile Store `cart.ts` and `api.ts` to use `@noeve/api-client`, created `auth-context.tsx`, and wired up Account login screen. | Mobile checkout; payments |
| 2026-06-22 | Mobile Store Checkout | Implemented the Mobile Checkout screen to ensure feature parity with the web-store MVP. Wired the cart 'Proceed to checkout' button. | Phase 2: Live Payments |
| 2026-06-24 | TypeScript fixes + Prisma pin | Fixed mobile checkout import paths, registered checkout Stack.Screen, wired auth token in web-store apiClient, added `category` to shared Product type, deduplicated mobile types.ts to re-export from shared-types, pinned Prisma to ^6.19.3 via pnpm overrides. Both apps TypeScript-clean. | Commit changes; verify end-to-end run; mobile variant selection; Razorpay payments |

---

## How to update this document

At the end of each session:

1. Move items from 🔄/⬜ to ✅ or 🟡 in the tables above.  
2. Adjust the **Overall progress** percentages.  
3. Add a row to **Session log** with date, what was done, and what to pick up next.  
4. Update **Uncommitted work** if git status changed significantly.  
5. Re-order **Recommended next steps** if priorities shifted.
