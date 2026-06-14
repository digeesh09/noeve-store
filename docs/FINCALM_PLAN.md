# FinCalm Project Roadmap & Work Items

## Overview
This document outlines the planned steps to complete the FinCalm application, spanning backend development, mobile frontend, testing, documentation, CI/CD, and deployment. Each major milestone contains actionable work items with checkboxes for progress tracking.

---

## 1️⃣ Project Setup
- [ ] Verify repository structure and create missing directories (`docs/`, `backend/`, `mobile/`).
- [ ] Add a `.gitignore` covering `node_modules/`, `.env`, `coverage/`, and build artifacts.
- [ ] Commit initial project scaffold.

---

## 2️⃣ Backend Development (Node.js / Express)
### 2.1 Database Connection
- [ ] Review and finalize `config/db.js` to use Mongoose with proper error handling.
- [ ] Ensure environment variables (`MONGO_URI`, `PORT`) are loaded via `dotenv`.
- [ ] Add unit tests for DB connection logic.

### 2.2 Core Health Endpoint (Completed)
- ✅ `/health` endpoint returns server status and MongoDB stats.
- ✅ Health test (`tests/health.test.js`) passes.

### 2.3 API Routes (Placeholder → Implement)
| Route | Description | Status |
|-------|-------------|--------|
| `auth` | User registration, login, JWT handling | ☐ Implement
| `transactions` | CRUD for financial transactions | ☐ Implement
| `loans` | Loan management endpoints | ☐ Implement
| `investments` | Investment tracking | ☐ Implement
| `creditCards` | Credit‑card CRUD | ☐ Implement
| `subscriptions` | Subscription lifecycle | ☐ Implement
| `insights` | AI‑driven financial insights | ☐ Implement

#### Tasks per Route (example for `auth`)
- [ ] Create `routes/auth.js` with Express router.
- [ ] Add placeholder handlers (`POST /api/auth/register`, `POST /api/auth/login`).
- [ ] Write integration tests in `tests/auth.test.js` using **supertest**.
- [ ] Document route in Swagger spec.

### 2.4 Testing Strategy
- [ ] Set up Jest and Supertest configuration.
- [ ] Write unit tests for utility functions.
- [ ] Write integration tests for each API route.
- [ ] Add coverage threshold enforcement.

### 2.5 API Documentation
- [ ] Install `swagger-ui-express` & `yamljs`.
- [ ] Create `docs/openapi.yaml` with basic spec.
- [ ] Serve Swagger UI at `/api-docs`.

---

## 3️⃣ Mobile Frontend (Expo React Native)
- [ ] Scaffold Expo project under `mobile/`.
- [ ] Apply **Sage Green** theme (colors, fonts).
- [ ] Implement navigation (Expo Router).
- [ ] Build screens: Dashboard, Transaction entry, Loan overview, Investment summary, Credit‑card manager, Subscriptions, Insights.
- [ ] Connect to backend via REST API.
- [ ] Add UI component library (e.g., **react-native-paper** or **native-base**).
- [ ] Write unit tests with **jest‑react‑native** and **react‑testing‑library**.

---

## 4️⃣ CI/CD Pipeline
- [ ] Configure GitHub Actions for lint, test, and build on push.
- [ ] Add separate jobs for backend and mobile.
- [ ] Deploy backend to a cloud provider (e.g., Render, Railway, or AWS Elastic Beanstalk).
- [ ] Set up Expo EAS Build for production binaries.

---

## 5️⃣ Deployment & Monitoring
- [ ] Deploy MongoDB Atlas cluster and configure IP whitelist.
- [ ] Create environment variable secrets in deployment platform.
- [ ] Set up health monitoring (uptime.com or similar).
- [ ] Configure log aggregation (e.g., Logtail, Papertrail).

---

## 6️⃣ Feature Backlog (Future Enhancements)
- [ ] Multi‑currency support.
- [ ] Real‑time push notifications for upcoming bills.
- [ ] AI‑driven budgeting suggestions.
- [ ] Export/Import data via CSV/JSON.
- [ ] Dark mode toggle for mobile app.

## 7️⃣ Next Milestones – Where to go from here?
- [ ] **Complete the Core API Surface** (transactions, loans, investments, credit cards, subscriptions, insights)
- [ ] **Strengthen Validation & Error Handling** (Joi/express-validator, errorHandler middleware)
- [ ] **Add Production‑Ready Utilities** (Winston/Morgan logging, rate limiting, CORS, Helmet, dotenv-safe)
- [ ] **API Documentation** (Swagger/OpenAPI spec at /api-docs)
- [ ] **Continuous Integration / Deployment**
  - [ ] Create GitHub Actions workflow: lint, test, build for backend and mobile
  - [ ] Add Dockerfile for backend service
  - [ ] Add Docker Compose file with MongoDB and backend containers
  - [ ] Set up CI to build and push Docker image to registry
  - [ ] Configure CI badge in README
- [ ] **Front‑End Integration**
  - [ ] Implement API client module in Expo app (Axios instance with JWT handling)
  - [ ] Create authentication flow with token storage (SecureStore)
  - [ ] Build screens to display transactions, loans, investments, credit cards, subscriptions, insights
  - [ ] Connect screens to backend endpoints
  - [ ] Write end‑to‑end tests with Detox
- [ ] **Optional Enhancements**
  - [ ] Password reset flow (email token)
  - [ ] Refresh token implementation
  - [ ] Analytics integration (mixpanel/segment)
  - [ ] Code coverage reports with Coveralls
- [ ] **Real‑time push notifications for upcoming bills**
  - [ ] Integrate Firebase Cloud Messaging for push
  - [ ] Backend schedule notifications (node-cron)
- [ ] **AI‑driven budgeting suggestions**
  - [ ] Design prompts for OpenAI API
  - [ ] Implement insights route using OpenAI
- [ ] **Export/Import data via CSV/JSON**
  - [ ] Add export endpoint for each entity
  - [ ] Add import endpoint with validation
- [ ] **Dark mode toggle for mobile app**
  - [ ] Implement theme switching with React Context
- [ ] **Front‑End Integration** (Expose endpoints to Expo or Next.js admin UI, JWT handling)
- [ ] **Optional Enhancements** (Password reset, refresh tokens, analytics, coverage reports)
- [ ] Real‑time push notifications for upcoming bills.
- [ ] AI‑driven budgeting suggestions.
- [ ] Export/Import data via CSV/JSON.
- [ ] Dark mode toggle for mobile app.

---
## 🔧 Upcoming Development Work Items
### 📈 Investments API
- [ ] Define Mongoose schema `Investment` (amount, type, date, notes)
- [ ] Implement CRUD routes in `routes/investments.js` (GET all, GET by id, POST, PUT, DELETE)
- [ ] Add request validation middleware (Joi) for create/update
- [ ] Write unit tests for model and integration tests for routes using supertest
- [ ] Document endpoints in Swagger (`/api-docs`)

### 📊 Loans API
- [ ] Define `Loan` Mongoose schema (principal, interestRate, term, startDate)
- [ ] Implement CRUD routes in `routes/loans.js`
- [ ] Add validation middleware
- [ ] Write tests for loan endpoints
- [ ] Update Swagger documentation

### 💳 Credit Cards API
- [ ] Define `CreditCard` schema (cardNumber, limit, balance, dueDate)
- [ ] Implement CRUD routes in `routes/creditCards.js`
- [ ] Validation and tests
- [ ] Swagger docs

### 📅 Subscriptions API
- [ ] Define `Subscription` schema (service, amount, billingCycle, nextDue)
- [ ] Implement routes in `routes/subscriptions.js`
- [ ] Validation, tests, docs

### 🤖 Insights API
- [ ] Design AI-driven insights endpoint using OpenAI
- [ ] Implement route `routes/insights.js`
- [ ] Create prompt templates and response handling
- [ ] Write tests and document in Swagger

### 📦 Front‑End Integration Tasks
- [ ] Build API client services in Expo app for each new endpoint
- [ ] Create screens to display and manage investments, loans, credit cards, subscriptions, insights
- [ ] Implement state management (e.g., Redux or Context API)
- [ ] End‑to‑end testing with Detox

### 📈 CI/CD Enhancements
- [ ] Extend GitHub Actions to run backend tests on each push
- [ ] Add step to lint Swagger/OpenAPI spec
- [ ] Deploy Docker image to staging environment for QA

---

## 📌 How to Use This Document
- Check a box (`[x]`) when a task is complete.
- Add additional tasks under the appropriate section as the project evolves.
- Commit changes to this file regularly to keep the roadmap in sync with actual progress.

*Last updated: 2026‑06‑12*
