# Plan for Tasks 4 to 8

## Overview
This plan outlines the approach for resolving the bug in the reports page, enhancing the analytics dashboard with real charts, adding support ticket hints to the orders report, and implementing a welcome experience for new customers.

## Task Breakdown

### Task 4: Fix `dailyRevenue.map is not a function` in `/dashboard/reports`
- **Issue**: The `dailyRevenue` data is likely being returned as `undefined`, `null`, or an object instead of an array.
- **Resolution Plan**: Inspect the data fetching logic in the reports page (`apps/web-admin/src/app/(dashboard)/dashboard/reports/page.tsx`). Add a fallback to an empty array (e.g., `(dailyRevenue || []).map(...)`) and verify the data structure matches expectations.

### Task 5 & 6: Fix and Enhance `/dashboard/analytics`
- **Issue**: The analytics page currently has placeholder text `[Chart Area]` instead of actual graphs.
- **Resolution Plan**: 
  1. Install a charting library like `recharts` in the `web-admin` project.
  2. Implement functional, responsive charts replacing the placeholders (e.g., a Line Chart for Revenue Over Time, and a Bar Chart for Top Selling Products).
  3. **Enhancements**: Add 2 additional charts (e.g., "User Acquisition Trend" and "Sales by Category" Pie Chart) to provide a richer analysis of the store's state.

### Task 7: Add Support Ticket Hints to Orders
- **Issue**: Admins need to know at a glance if an order has an open support ticket.
- **Resolution Plan**: Modify the orders list (`apps/web-admin/src/app/(dashboard)/dashboard/orders/page.tsx`). We will check if an order has associated open tickets and display a visually distinct warning badge or icon (like a red alert icon) next to the order ID or status.

### Task 8: New Customer Welcome Experience
- **Issue**: New users lack a premium welcoming experience upon registration/first login.
- **Resolution Plan**:
  1. **Welcome Note**: Create a beautifully crafted modal or banner that triggers on the customer's first login in the store application (`apps/web-store`).
  2. **Welcome Email**: Implement an HTML email template for welcoming the user. We will integrate this into the registration flow (either simulating the email send if an SMTP provider isn't set up, or hooking it into the existing notification service).

## Questions for Clarification
1. **Charts**: Is `recharts` an acceptable library to add for the analytics graphs?
2. **Email**: Do we have an active email service (like SendGrid or Resend) configured, or should I just mock the email sending function and log the beautiful HTML output to the console/files?
3. **Orders Data**: Is the orders data currently mocked, or should I be querying a real database/API to check for support tickets?

Please let me know if this plan is approved and provide any answers to the questions above before I proceed!
