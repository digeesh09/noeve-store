# Noeve — Work Tracker

Living document for project progress. Update this file at the end of each work session so the next session can resume quickly.

**Brand:** Noeve — ladies brand store (ornaments, jewellery, accessories, apparel, care products).  
**Stack:** pnpm monorepo · NestJS API · Next.js web-store & web-admin · Expo mobile-store & mobile-admin  
**Design spec:** [UI_DESIGN_LAYOUT.md](./UI_DESIGN_LAYOUT.md) · **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Overall progress (as of 2026-06-26)

| Phase | Scope | Status | Estimate |
|-------|--------|--------|----------|
| **MVP** | API + web-store + web-admin: catalog, cart, checkout, orders, manual fulfillment | ✅ **Done** | 100% |
| **Phase 2** | mobile-store polish, live payments, email notifications | **In progress** | ~75% |
| **Phase 3** | mobile-admin scanning, push tracking, promotions | **Not started** | ~5% |
| **Phase 4** | Search, analytics, multi-warehouse, loyalty | **Not started** | 0% |
| **Phase 5** | Enterprise & B2B: Mega menu, blogs, custom modules, B2B quotes, advanced workflows | **Not started** | 0% |

**Where we stopped:** Web-store and mobile-store visual and structural styling synchronized with the hosted `ReferenceDesign` specifications. Replaced Tailwind/custom layouts on the web storefront with global CSS classes (`.wrap`, `.breadcrumb`, `.page-head`, `.auth__form-card`, `.cart-layout`, `.pdp`). Updated shared UI design tokens color palette and extended theme updates across all mobile-store screens (Home, Shop, Cart, Account, Product Details, and Checkout) to ensure a premium cream/oxblood/stone appearance. Staged and committed changes; all TS checks and test runs passing.

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
| Premium CSS theme (cream, oxblood, stone, ink) | ✅ | Handcrafted brand tokens in variables and global CSS classes |
| Home (hero, collections, featured, testimonials, trust) | ✅ | Redesigned to match reference templates and testimonials strip |
| Shop listing + category filter | ✅ | Redesigned with `.breadcrumb`, `.page-head`, `.card` layouts |
| Product detail + configurators + accordion | ✅ | Detailed PDP client, variant selection, size pills, care/shipping accordions |
| Cart (sidebar layout, live API, trust badges) | ✅ | Redesigned to match layout grid and badge list |
| Site header / footer / nav | ✅ | Updated logo, new category tags, and marquee animation bar |
| Account / login / register | ✅ | Standardized auth panel cards, perks sidebar, and confirm-password toggles |
| Checkout page | ✅ | `/checkout` — place order with summary panel |
| Order history & Profile details | ✅ | Expandable order summary cards and tab navigation |
| Wishlist | 🟡 | UI placeholder on PDP only |
| Auth token wired to apiClient | ✅ | Reads from cookie access token |
| TypeScript & Test clean | ✅ | All tests passing and types checked |

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
| Tab bar (Home, Shop, Cart, Account) | ✅ | Premium brand colors, navigation tabs, bag counters |
| Home (hero banner, collections slider) | ✅ | Updated to use premium cream, ink, and primary oxblood values |
| Shop (category chips, grid) | ✅ | Updated chip styles to match design colors |
| Product detail | ✅ | Beautifully styled light details header, selectors, description, and specs |
| Cart (live API) | ✅ | Premium cream/oxblood theme and rectangular component forms |
| Account / login | ✅ | Rectangular text inputs, credentials hint, and member perk items |
| Checkout / orders | ✅ | Place order screen with summary, optional notes, and confirm cards |
| TypeScript & Test clean | ✅ | All TS variables and unused imports cleaned up; tests passing |

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
| `@noeve/ui-tokens` | ✅ | Refined colors and typography configuration |
| `@noeve/shared-types` | 🟡 | Re-exports cleanly across monorepo |
| `@noeve/validation` | 🟡 | Auth and order validations |
| `@noeve/api-client` | ✅ | Auth, catalog, cart, orders, admin client |
| `@noeve/config-typescript` | ✅ | |

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

## Recommended next steps (priority order)

### Phase 2 — Payments & Backend Integrations

1. **Razorpay integration** — Implement payment API endpoints (`POST /store/payments/create-order` and webhook verification).
2. **Order Payment Status flow** — Update order state (`PENDING_PAYMENT` → `CONFIRMED`) upon receipt of successful payment event.
3. **Web & Mobile payment UI** — Replace default checkout buttons with Razorpay modal components (web) and `react-native-razorpay` elements (mobile).

### Phase 2 — Communication & Extras

4. **Email notifications** — Order conformation, dispatch status messages via NodeMailer/Resend.
5. **Fulfillment queue UI (web-admin)** — Implement action buttons for PICK, PACK, and SHIP pipelines.

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
| 2026-06-26 | Noeve Visual Parity & Sync | Standardized login, registration, cart, product detail, account, and checkout layouts using global CSS classes matching ReferenceDesign. Updated shared UI tokens color theme and fully styled the mobile-store applications screens. Staged & committed changes. | Phase 2: Payment Gateway Integration |

---

## How to update this document

At the end of each session:

1. Move items from 🔄/⬜ to ✅ or 🟡 in the tables above.  
2. Adjust the **Overall progress** percentages.  
3. Add a row to **Session log** with date, what was done, and what to pick up next.  
4. Update **Uncommitted work** if git status changed significantly.  
5. Re-order **Recommended next steps** if priorities shifted.
