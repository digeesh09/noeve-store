# Plan for Tasks 9 to 11

## Overview
This plan outlines the approach to replace dummy analytics with real data, verify the accuracy of the Daily Revenue report, and improve/implement the navigation progress spinners for both the admin and store applications.

## Task Breakdown

### Task 9: Real Data for Analytics Dashboard
- **Issue**: The charts implemented in Task 5 & 6 currently use static dummy arrays.
- **Resolution Plan**: 
  1. I will update `apps/web-admin/src/app/(dashboard)/dashboard/analytics/page.tsx` to asynchronously fetch data on component mount, similar to the Reports page.
  2. I will reuse the `fetchReportsData` API wrapper to get real data for:
     - `daily-revenue` (for the Line Chart)
     - `top-products` (for the Bar Chart)
     - `orders-by-status` or a category breakdown (for the Pie Chart)
  3. *Note*: If a specific metric like "User Acquisition" isn't supported by the current reports API, I will either adapt an existing endpoint to provide it or replace that chart with a supported metric (like Recent Transactions volume).

### Task 10: Verify Daily Revenue Correctness
- **Issue**: The user questions the accuracy of the Daily Revenue logic.
- **Investigation Plan**: I will inspect the backend logic in `apps/api/src/modules/reports/reports.service.ts`.
- **Expected Resolution**: Common issues with daily revenue include summing *all* orders (even cancelled/unpaid ones) or timezone grouping issues. I will ensure the Prisma query only sums the `totalCents` of successful/confirmed orders and properly groups the dates. I will apply the fix directly to the backend service.

### Task 11: Navigation Progress Spinners
- **Issue**: Admin spinner is slow and affects load times; the Store lacks a spinner entirely.
- **Resolution Plan**:
  1. **Admin Module**: I will inspect `apps/web-admin/src/components/NavigationProgress.tsx`. If it uses a blocking or inefficient React state interval, I will replace it with a lightweight, non-blocking CSS-based transition (like `nprogress` or a customized lightweight component) that hooks into Next.js router events without slowing down the UI thread.
  2. **Store Module**: I will implement a similar lightweight, fast top-bar progress indicator in `apps/web-store/src/app/layout.tsx` to provide users with immediate visual feedback when they click links and navigate the store.

## Questions for Clarification
1. **Analytics Data**: If the backend does not currently have a "User Acquisition" endpoint, would you prefer I build one in the backend, or should I replace that specific chart with something else (like "Orders by Status")?
2. **Daily Revenue Criteria**: What statuses should be considered "revenue"? (e.g., Should `CONFIRMED`, `SHIPPED`, and `DELIVERED` be included, while `CANCELLED`, `REFUNDED`, and `PENDING_PAYMENT` are excluded?)
3. **Progress Bar Style**: Do you prefer a subtle top-of-screen progress bar (like GitHub/YouTube) over a central spinning wheel?

Please review this plan and let me know your thoughts before I proceed!
