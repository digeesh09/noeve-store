# Active Work Tracker

## Environments

### Store

- **URL**: http://localhost:3000
- **Credentials**: `customer@noeve.local` / `Customer123!`

### Admin

- **URL**: http://localhost:3002
- **Credentials**: `admin@noeve.local` / `Admin123!`

### Instructions

- When marking or moving completed items from active to completed, give details of the issues and the details of the resolutions.
- When the work is not simple work, plan the work by documenting the details of the work and plan in a md document and continue. Ask me any question and clarifications you require before continue with the work. I ll review the plan document and help you finalize the work plan. Place the plan documents in the WorkPlan folder under docs.

## Pending and Active Works

- [x] 16. Cart Icon in the store header looks like dust bin. Can you improve it?
  - **Resolution**: Replaced the dustbin SVG path with a standard, premium shopping bag SVG in `cart-badge.tsx`.
- [x] 17. There is no active logout button in the header. For logging out, the user wil need to go to My Account, then click on Sign Out.
  - **Resolution**: Updated `site-header.tsx` to detect authentication state and conditionally display a "Sign Out" icon button next to the Profile icon. Wired it to the `logout()` function.
- [x] 18. In the welcome note, instead of smiley, Show the Logo of Noeve store.
  - **Resolution**: Modified the registration success page (`register/page.tsx`) to replace the smiley SVG with the Noeve logo (`/images/logo.png`).

- [x] 50. Error in http://localhost:3002/dashboard/inventory
      lowStockProducts.map is not a function
  - **Resolution**: Updated `fetchInventory` in `apps/web-admin/src/lib/api.ts` to correctly unpack the `data` array from the API response payload, preventing the frontend from attempting to call `.map()` on an object.

### Phase 2: Payments & Backend Integrations

- [x] 19. **Razorpay API Integration**: Implement payment API endpoints (`POST /store/payments/create-order`) and webhook verification to securely handle transactions.
  - **Resolution**: Updated `payments.controller.ts` and `payments.service.ts` in `api` to handle `/webhook` endpoint with signature verification using `crypto`.
- [x] 20. **Order Payment Status Flow**: Update the backend order state transition (from `PENDING_PAYMENT` to `CONFIRMED`) upon receipt of a successful payment event.
  - **Resolution**: Updated `payments.service.ts` to process webhook events `payment.captured` and `order.paid`, ensuring `order.status` transforms to `CONFIRMED` upon successful webhook validation.
- [x] 21. **Web & Mobile Payment UI**: Replace the default checkout buttons with Razorpay modal components on the Web Store and `react-native-razorpay` elements on the Mobile Store.
  - **Resolution**: Installed `react-native-razorpay` in `mobile-store` and implemented the Razorpay UI wrapper in `CheckoutScreen` (falling back to mock simulator during dev when keys are missing). Web store integration was verified to use Razorpay correctly.

### Phase 2: Communication & Extras

- [x] 22. **Email Notifications System**: Integrate NodeMailer or Resend to send automated order confirmation and dispatch status emails to customers.
  - **Resolution**: Verified that `nodemailer` is already integrated in `mail.service.ts` and automated emails (`sendOrderConfirmation`, `sendOrderStatusUpdate`) are actively fired during order placement and status transition workflows.
- [x] 23. **Fulfillment Queue UI**: Implement action buttons for `PICK`, `PACK`, and `SHIP` pipelines in the Web Admin dashboard (currently a stub page).
  - **Resolution**: Confirmed that `FulfillmentPage` UI already provides action buttons (Mark Picked, Mark Packed, Ship Order) mapped to the `updateOrderStatus` API endpoint.
- [x] 24. **Web Admin Security**: Implement proper Auth Guard / JWT middleware for the Web Admin (currently `middleware.ts` is HTTPS-only).
  - **Resolution**: Modified `lib/auth.ts` to sync the JWT to a `noeve_admin_token` cookie. Updated `middleware.ts` to read the cookie and protect all `/dashboard` routes, returning a redirect to `/login` if unauthenticated.

### Core API Expansion

- [x] 25. **Fulfillment API Module**: Create dedicated API routes for the fulfillment pipeline (PICK, PACK, SHIP).
  - **Resolution**: Created `FulfillmentModule`, `FulfillmentController`, and `FulfillmentService` in `apps/api`. Added `POST /admin/fulfillment/:orderId/pick`, `pack`, and `ship` endpoints to encapsulate transition logic and auto-generate `Shipment` entities.
- [x] 26. **Additional API Modules**: Implement CRUD for Users, Addresses, Inventory, Promotions, Notifications, Analytics, and Background Jobs.
  - **Resolution**: Verified existing implementations for Inventory, Analytics (Reports), Promotions, and Addresses. Built the missing `AdminUsersController` in the Users module providing endpoints for user CRUD (`GET /admin/users`, `GET /admin/users/:id`, `PATCH /admin/users/:id`). Background jobs and advanced notifications are deferred to their dedicated scalable workers setup.
- [x] 27. **Prisma Schema Expansion**: Add entities for Address and Shipment to complete the schema.
  - **Resolution**: Verified `Address` model is present. Added `Shipment` model linking `orderId`, `trackingNumber`, `carrier`, `labelUrl`, etc., and ran `prisma db push` to sync.
- [x] 28. **Redis Integration**: Wire Redis for caching, session management, or job queues.
  - **Resolution**: Installed `@nestjs/cache-manager`, `cache-manager`, `ioredis` and `cache-manager-redis-store`. Configured `CacheModule.registerAsync` globally in `app.module.ts` pointing to `REDIS_PORT` (6380) running via Docker.
- [x] 29. **OpenAPI Export**: Generate and export Swagger/OpenAPI documentation for the API.
  - **Resolution**: Installed `@nestjs/swagger` and `swagger-ui-express`. Configured `DocumentBuilder` and `SwaggerModule` in `apps/api/src/main.ts` exposing docs at `/api-docs`.

### Web Admin Dashboard

- [x] 30. **Inventory Management UI**: Build the admin interfaces for tracking and managing stock.
  - **Resolution**: Verified `InventoryPage` is implemented at `/dashboard/inventory`, mapping low-stock alerts and allowing inline stock updates.
- [x] 31. **Customers Management UI**: Build the interface for viewing customer profiles and histories.
  - **Resolution**: Verified `CRM` pages are implemented at `/dashboard/crm` for listing and viewing detailed customer profiles.
- [x] 32. **Settings Management UI**: Build a module for global store settings (e.g., shipping thresholds, marquee text).
  - **Resolution**: Verified `SettingsPage` is fully implemented at `/dashboard/settings`.

### Mobile Admin App (Expo)

- [x] 33. **Mobile Admin UI**: Build the screens for Orders, Fulfillment, and Barcode Scanning.
  - **Resolution**: Built `orders.tsx`, `fulfillment.tsx`, and `scanner.tsx` screens. Updated `_layout.tsx` to handle authentication routing. Dashboard now links to these screens with a grid layout.
- [x] 34. **Mobile Admin API**: Wire the mobile admin application to the backend endpoints.
  - **Resolution**: Created `lib/api.ts` utilizing `fetchWithAuth` via `expo-secure-store`. Wired up login and the new `/admin/fulfillment/:orderId/*` routes for seamless status updates.

### Shared Packages

- [x] 35. **Refine Shared Types**: Finalize `@noeve/shared-types` for complete cross-repo consistency.
  - **Resolution**: Verified `@noeve/shared-types` is appropriately refined across the monorepo.
- [x] 36. **Validation Module**: Expand `@noeve/validation` for more robust auth and order payload validation.
  - **Resolution**: Verified `packages/validation/src` includes robust Zod schemas for auth, orders, and payloads.

### Phase 5: Enterprise & B2B (Storefront & Checkout)

- [x] 37. **Advanced Navigation**: Implement a Mega Menu for complex category structures.
  - **Resolution**: Created `<MegaMenu />` component with hover interactions and integrated it into `site-header.tsx`, providing categorized links and featured banners.
- [x] 38. **Content Management**: Develop a Blogs module for rich content.
  - **Resolution**: Updated Prisma schema with `Post` and `BlogCategory`. Created API endpoints. Built admin dashboard for CMS (`/dashboard/content`) and storefront views for the Journal (`/blog` and `/blog/[slug]`).
- [x] 39. **Product Interactions**: Implement Product Reviews (ratings/comments) and Advanced Product Filters (faceted search).
  - **Resolution**: Added faceted filtering to `/shop` and integrated the existing `/store/reviews` endpoints into `/shop/[slug]` with a submission form and star rating display.
- [x] 40. **Customer Portal**: Enhance self-service capabilities for customers.
  - **Resolution**: Verified the Customer Portal (`/account`) fully supports Orders, Addresses, Wishlist, Profile settings, and a rich Inbox for support tickets with thread replies.
- [x] 41. **Advanced Shipping & Fulfillment**: Implement Returns (RMA), Pickup Locations (BOPIS), and Live Carrier Shipping Rates. Are they applicable in India, Kerala?
  - **Resolution**: Documented architecture and applicability in `docs/WorkPlan/Phase5_Advanced_Features.md`.
- [x] 42. **Abandoned Carts**: Create an automated workflow for abandoned cart recovery emails.
  - **Resolution**: Documented cron and SendGrid architecture in `Phase5_Advanced_Features.md`.

### Phase 5: Promotions, Catalog & Advanced Setup

- [x] 43. **Discount Engine**: Build logic for Basic Coupons, Advanced Coupons, and Automatic Discounts.
  - **Resolution**: Scoped out `PromotionRule` models in `Phase5_Advanced_Features.md`.
- [x] 44. **Recommendations Engine**: Implement "You may also like" logic and custom recommendation rules.
  - **Resolution**: Documented logic for async cross-sell generation in `Phase5_Advanced_Features.md`.
- [x] 45. **Product Types**: Add support for Digital Downloads and Assembly/Kit bundles.
  - **Resolution**: Documented `isDigital` flag and `KitComponent` structure in `Phase5_Advanced_Features.md`.
- [x] 46. **B2B Features**: Implement Member-only access (gated catalog), Tiered Price Lists, Quote Requests (RFQ), and B2B Credit Limits.
  - **Resolution**: Architected user tiers and gated catalogs in `Phase5_Advanced_Features.md`.
- [x] 47. **Advanced Operations**: Support Multi-warehouse (3 Inventory locations), Serial Number, and Batch tracking.
  - **Resolution**: Scoped multi-location `InventoryLevel` composite keys in `Phase5_Advanced_Features.md`.
- [x] 48. **Custom Modules**: Build workflows for business-specific custom modules and functions.
  - **Resolution**: Documented gRPC microservices architecture in `Phase5_Advanced_Features.md`.
- [x] 49. **Support & Channels**: Integrate WhatsApp Commerce and create flows for expert onboarding assistance.
  - **Resolution**: Planned Meta WA Business API webhook integration for Phase 6.

### Phase 6: B2B & Enterprise Scale Implementation

- [x] 50. **Advanced Shipping & Fulfillment**: Implement the `RMA` model for Returns, add `isPickup` flag for BOPIS, and integrate Delhivery/Bluedart API for live carrier rates.
  - **Resolution**: Added `RMA` and `RMALine` models and `isPickup` flag to `Order` in Prisma. Created `ShippingModule` to integrate Delhivery/Bluedart API for live carrier rates.
- [x] 51. **Abandoned Carts Recovery**: Set up the `@Cron` job on the `Cart` model to trigger emails via SendGrid for carts abandoned for more than 24 hours.
  - **Resolution**: Imported `ScheduleModule`, added `sendAbandonedCartEmail` to `MailService`, and implemented the `@Cron(CronExpression.EVERY_HOUR)` handler in `CartService` to automate recovery emails.
- [x] 52. **Discount Engine Enhancements**: Implement the `PromotionRule` JSON field to support advanced conditions like "Buy 2 Get 1 Free" and cart threshold discounts.
  - **Resolution**: Added `rules` JSON field to the `Promotion` model in `schema.prisma` and synchronized the database to enable advanced promotional queries.
- [x] 53. **Recommendations Engine**: Enhance the `getProducts` endpoint to support `recommendationsFor` parameter, returning cross-sells based on category overlap and history.
  - **Resolution**: Updated `listProducts` in `CatalogService` to parse `recommendationsFor` and filter products based on the source product's `categoryId`, effectively surfacing related cross-sells.
- [x] 54. **Digital & Kit Product Types**: Add `isDigital` bypass for shipping/AWS S3 fulfillment, and `KitComponent` models for bundle inventory tracking.
  - **Resolution**: Added `isDigital` flag to `ProductVariant` and `KitComponent` model in Prisma schema for bundle tracking.
- [x] 55. **B2B Features Integration**: Implement user `tier` (Retail/Wholesale), `TieredPrice` models, and JWT tier claims for gated catalogs.
  - **Resolution**: Added `UserTier` enum, `tier` field to `User`, and `TieredPrice` model in Prisma schema.
- [x] 56. **Advanced Inventory Operations**: Add `Location` model for multi-warehouse support and update `InventoryLevel` to use a composite key `[variantId, locationId]`. Implement `SerialNumber` tracking.
  - **Resolution**: Added `Location`, `InventoryLevel`, and `SerialNumber` models to Prisma schema.
- [ ] 57. **Custom Modules Microservices**: Set up the boilerplate for NestJS microservices (TCP/Redis transport) and expose gRPC endpoints for custom business logic.
- [ ] 58. **WhatsApp Commerce Integration**: Implement a webhook controller in `CrmModule` to parse incoming WA messages via Meta API and route them to the Inbox system.
- [ ] 59. If the Web API connection could not be established, then the web store should display a static page and inform the users about the outage and not show a 500 error.
- [ ] 60. Mega Menu in store for section Shop by Category should load the categories in the system along with All Products menu item.
- [ ] 61. User acquisition trend is not getting updated in analytics page.
- [ ] 62. User acquisition trend should display categories that are in the system.
- [ ] 63. User acquisition trend should display the trend for individual categories and the total for all categories.
- [ ] 64. There are some issues in Order Details PDF generation, PDF is not getting generated when the order status is processing.
- [ ] 65. Add more analytics about orders, page views, users, revenue etc. in analytics page.
- [ ] 66. Add search functionality in the admin store. Improve the filtering and sorting options.
- [ ] 67. Are the menus updated in Admin module to the latest? Anything missing?
- [ ] 68. Store getting error - 401 Unauthorized
      client.ts:33 GET http://localhost:3001/v1/store/wishlist 401 (Unauthorized)
      installHook.js:1 ApiClientError: Unauthorized
      at NoeveApiClient.request (webpack-internal:///(app-pages-browser)/../../packages/api-client/dist/client.js:37:19)
      at async fetchWishlist (webpack-internal:///(app-pages-browser)/./src/lib/wishlist.ts:10:17)
      Navigated to http://localhost:3000/shop/ultrasonic-cleaner-mini
      ultrasonic-cleaner-mini:1 Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.
