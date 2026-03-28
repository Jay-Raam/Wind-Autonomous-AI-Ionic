# NextAI — Wind-Powered AI Task Manager

A full-stack, production-ready platform for orchestrating autonomous AI agents. Users create tasks through a cross-platform mobile/web app; the backend breaks each task into a multi-agent pipeline (Planner → Research → Analysis → Writer), streams live progress over Socket.IO, and persists everything in MongoDB.

---

## Table of Contents

1. [What Problem Are We Solving?](#what-problem-are-we-solving)
2. [How Does Wind AI Work?](#how-does-wind-ai-work)
3. [Screenshots](#screenshots)
4. [Overview](#overview)
5. [Architecture](#architecture)
6. [Tech Stack](#tech-stack)
7. [Project Structure](#project-structure)
8. [Features](#features)
9. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
10. [Environment Variables](#environment-variables)
    - [Backend](#backend-env)
    - [Frontend](#frontend-env)
11. [API Reference](#api-reference)
    - [REST Endpoints](#rest-endpoints)
    - [GraphQL](#graphql)
    - [Socket.IO Events](#socketio-events)
12. [Mobile Build](#mobile-build)
13. [Security](#security)
14. [Scripts Reference](#scripts-reference)

---

## What Problem Are We Solving?

Modern knowledge work is repetitive and slow: researching a topic, analysing findings, drafting a report — each step requires context-switching between tools and waiting on human turn-around.

**Wind AI eliminates that cycle.**

| Pain today                                               | How NextAI fixes it                                                          |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Tasks require many manual research steps                 | One natural-language prompt kicks off an entire agent pipeline               |
| AI tools give a single response with no chain-of-thought | Planner → Research → Analysis → Writer agents each own a specific step       |
| No visibility into what the AI is actually doing         | Every agent step and tool call streams live to your screen in real time      |
| Results disappear after the session                      | Every task, agent log, and tool result is persisted and queryable            |
| AI behaviour is a black box                              | Configurable model, temperature, tool approval, and autonomous mode per user |
| Desktop-only AI interfaces                               | Full cross-platform support: web, Android, and iOS from one codebase         |

---

## How Does Wind AI Work?

When you submit a task, the following happens automatically:

### Step 1 — Task is created and queued

```
User writes a prompt  →  POST /api/tasks
                              ↓
                    Task saved as "pending"
                              ↓
                   Pushed into BullMQ queue
                   (or executed inline if Redis
                    is not available)
```

### Step 2 — Planner Agent breaks it down

The PlannerAgent reads the user prompt and produces a structured execution plan — what to research, what to analyse, and what the final output format should be.

### Step 3 — Research Agent gathers data

The ResearchAgent uses the **WebSearchTool** to fetch real information relevant to the plan. Tool calls are persisted and visible in the Task Detail screen.

### Step 4 — Analysis Agent processes findings

The AnalysisAgent reads the raw research output, identifies patterns, draws conclusions, and builds a structured data payload for the writer.

### Step 5 — Writer Agent produces the final result

The WriterAgent synthesises the analysis into a polished, human-readable response — the `result` field stored on the task.

### Step 6 — Live updates all the way through

Every agent status change emits a Socket.IO event to the task's room. The frontend polls and listens so the UI updates without a page refresh.

```
BullMQ worker
    │
    ├─ PlannerAgent  ──────────────────► socket: agent_step
    ├─ ResearchAgent + WebSearchTool  ──► socket: tool_executed
    ├─ AnalysisAgent ─────────────────► socket: agent_step
    └─ WriterAgent   ──► result saved ──► socket: task_completed
```

### LLM Provider fallback

If the primary LLM provider fails or has no API key configured, the system automatically falls through:

```
Preferred provider → Gemini → OpenRouter → OpenAI → Local (Ollama)
```

This means the system keeps working even during provider outages or during local development without any paid API key.

---

### Login

![Login screen](./docs/screenshots/login.png)

### Dashboard — Task List

![Dashboard](./docs/screenshots/dashboard.png)

### Create Task

![Create task](./docs/screenshots/create-task.png)

### Task Detail — Live Agent Steps

![Task detail](./docs/screenshots/task-detail.png)

### Settings

![Settings](./docs/screenshots/settings.png)

> To add real screenshots: create a `docs/screenshots/` folder in the repo root, drop in your PNG files, and the links above will resolve automatically.

---

## Overview

NextAI lets you submit a natural-language task and watch a chain of AI agents execute it in real time. Each task goes through:

```
Client creates task
       ↓
PlannerAgent   →   ResearchAgent   →   AnalysisAgent   →   WriterAgent
       ↓                  ↓                  ↓                  ↓
  Socket event       WebSearchTool      Socket event       Final result
```

Results, agent steps, and tool calls are all persisted and available through REST, GraphQL, and live socket events.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      NextAI (Ionic/React)                        │
│                                                                  │
│   Pages ──► Hooks/Guards ──► Zustand Stores ──► API Services    │
│                                                         │        │
│                                               Axios HTTP Client  │
└─────────────────────────────────────────────────────────┬────────┘
                                                           │ REST / GraphQL / WS
┌─────────────────────────────────────────────────────────▼────────┐
│                     Wind Backend (Express)                        │
│                                                                  │
│   Routes ──► Middlewares ──► Controllers ──► Services            │
│                                                  │               │
│              Repositories ◄──────────────────────┘               │
│                    │                                             │
│               MongoDB (Mongoose)                                 │
│                                                                  │
│   BullMQ Queues ──► Workers ──► LLM Service (multi-provider)    │
│                                                                  │
│   Socket.IO ──► Real-time task/agent/tool events                │
│   GraphQL Yoga ──► Query/Mutation API                           │
│   Redis ──► Queue transport + response cache (optional)         │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend

| Layer     | Technology                                     |
| --------- | ---------------------------------------------- |
| Framework | Ionic React 8 + React 19                       |
| Language  | TypeScript 5                                   |
| State     | Zustand 5                                      |
| HTTP      | Axios (with interceptors + auto token refresh) |
| Mobile    | Capacitor 7 (Android / iOS)                    |
| Build     | Vite 5                                         |
| Styling   | Tailwind CSS 4                                 |
| Tests     | Vitest + Cypress                               |

### Backend

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Runtime    | Node.js 20+                                |
| Language   | TypeScript 5                               |
| HTTP       | Express 4                                  |
| Database   | MongoDB 7 + Mongoose 8                     |
| Queue      | BullMQ + Redis (optional, inline fallback) |
| Real-time  | Socket.IO 4                                |
| GraphQL    | GraphQL Yoga 5                             |
| Auth       | JWT (access + refresh) + bcrypt            |
| Validation | Zod                                        |
| Logging    | Pino                                       |
| Deploy     | Vercel (serverless) or Node process        |

### LLM Providers (priority order with fallback)

- Gemini (Google)
- OpenRouter
- OpenAI
- Local (Ollama)

---

## Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── app.ts                  # Express app factory
│   │   ├── server.ts               # HTTP server entry
│   │   ├── vercel.ts               # Vercel serverless entry
│   │   ├── config/
│   │   │   ├── database.ts         # Mongoose connection
│   │   │   ├── env.ts              # Zod-validated env schema
│   │   │   └── redis.ts            # Redis/BullMQ connection
│   │   ├── controllers/            # Request/response handlers
│   │   ├── services/               # Business logic
│   │   │   └── llm.service.ts      # Multi-provider LLM calls
│   │   ├── repositories/           # MongoDB data access
│   │   ├── models/                 # Mongoose schemas
│   │   ├── routes/                 # Route composition
│   │   ├── queues/                 # BullMQ queue definitions
│   │   ├── workers/                # Queue worker processors
│   │   ├── graphql/                # Schema, resolvers, context
│   │   ├── sockets/                # Socket.IO server
│   │   ├── events/                 # Socket event constants
│   │   ├── middlewares/            # Auth, validate, sanitize, rate-limit
│   │   ├── types/                  # TypeScript declarations
│   │   └── utils/                  # Errors, logger, cookies, etc.
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json
│
├── Frontend/
│   ├── src/
│   │   ├── api/                    # Axios service layer
│   │   │   ├── http-client.ts
│   │   │   ├── auth-api.ts
│   │   │   ├── settings-api.ts
│   │   │   └── task-api.ts
│   │   ├── store/                  # Zustand stores
│   │   │   ├── auth-store.ts
│   │   │   ├── settings-store.ts
│   │   │   ├── task-store.ts
│   │   │   └── ui-store.ts
│   │   ├── pages/                  # Screens
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CreateTaskPage.tsx
│   │   │   ├── TaskDetailPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── components/             # Reusable UI
│   │   ├── guards/                 # ProtectedRoute
│   │   ├── hooks/                  # useForm, useToast, usePollTask, useAuthGuard
│   │   ├── router/                 # AppRouter with auth-aware routing
│   │   ├── types/                  # Shared TypeScript interfaces
│   │   ├── utils/                  # Storage, errors, formatters
│   │   └── config/env.ts           # Vite env accessor
│   ├── android/                    # Capacitor Android project
│   ├── cypress/                    # E2E tests
│   ├── .env.example
│   ├── .gitignore
│   ├── capacitor.config.ts
│   ├── ionic.config.json
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## Features

### Authentication

- Register and login with email + password
- JWT access token (15 min) + refresh token (30 days)
- Automatic token refresh via Axios interceptor — no user interaction needed
- Tokens stored securely with Capacitor Storage
- Auth state hydration on app/page refresh with no false redirect to login

### Task Management

- Create tasks with plain-language descriptions and optional file attachments
- Task status: `pending` → `running` → `completed` / `failed`
- View per-task agent and tool execution history
- Real-time status updates via Socket.IO

### Multi-Agent Pipeline

- **PlannerAgent** — breaks the goal into steps
- **ResearchAgent** — runs WebSearchTool to gather data
- **AnalysisAgent** — processes gathered data
- **WriterAgent** — produces the final written result
- Each agent step is persisted and emits a live socket event

### AI Settings

- Select AI model: `Wind v2.5`, `Wind v2.0`, `DeepThink v1.0`
- Adjust temperature (0.0 – 1.0)
- Toggle Require Tool Approval
- Toggle Autonomous Mode

### Real-time

- Socket.IO room per task — join with `join_task`
- Events: `task_started`, `agent_step`, `tool_executed`, `task_completed`, `task_failed`

---

## Getting Started

### Prerequisites

| Tool      | Minimum version |
| --------- | --------------- |
| Node.js   | 20.x            |
| npm       | 9.x             |
| MongoDB   | 7.x             |
| Redis     | 7.x (optional)  |
| Ionic CLI | latest          |

---

### Backend Setup

```bash
# 1. Enter backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env with your values (see Environment Variables section)

# 5. Start development server (hot-reload)
npm run dev
```

Server starts on `http://localhost:8080` by default.

---

### Frontend Setup

```bash
# 1. Enter frontend directory
cd Frontend

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Set your backend API URL
# VITE_API_URL=http://localhost:8080/api

# 5. Start Ionic development server
npm run dev
```

App opens at `http://localhost:5173`.

---

## Environment Variables

### Backend

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable             | Required | Default                                 | Description                                               |
| -------------------- | -------- | --------------------------------------- | --------------------------------------------------------- |
| `NODE_ENV`           |          | `development`                           | Environment mode                                          |
| `PORT`               |          | `8080`                                  | HTTP server port                                          |
| `MONGODB_URI`        | ✅       | —                                       | MongoDB connection string                                 |
| `REDIS_ENABLED`      |          | `false`                                 | Enable BullMQ queues                                      |
| `REDIS_URL`          | ✅       | —                                       | Redis connection string                                   |
| `JWT_ACCESS_SECRET`  | ✅       | —                                       | Min 32 chars — sign access tokens                         |
| `JWT_REFRESH_SECRET` | ✅       | —                                       | Min 32 chars — sign refresh tokens                        |
| `JWT_ACCESS_TTL`     |          | `15m`                                   | Access token lifetime                                     |
| `JWT_REFRESH_TTL`    |          | `30d`                                   | Refresh token lifetime                                    |
| `LLM_PROVIDER`       |          | `openrouter`                            | Primary LLM: `gemini` / `openrouter` / `openai` / `local` |
| `GEMINI_API_KEY`     |          | —                                       | Google Gemini API key                                     |
| `GEMINI_MODEL`       |          | `gemini-2.0-flash`                      | Gemini model name                                         |
| `OPENROUTER_API_KEY` |          | —                                       | OpenRouter API key                                        |
| `OPENROUTER_MODEL`   |          | `meta-llama/llama-3.3-8b-instruct:free` | Model via OpenRouter                                      |
| `OPENAI_API_KEY`     |          | —                                       | OpenAI API key                                            |
| `OPENAI_BASE_URL`    |          | `https://api.openai.com/v1`             | OpenAI-compatible base URL                                |
| `LOCAL_LLM_BASE_URL` |          | `http://localhost:11434`                | Local Ollama endpoint                                     |
| `ALLOWED_ORIGINS`    |          | `http://localhost:3000`                 | Comma-separated CORS origins                              |
| `BCRYPT_SALT_ROUNDS` |          | `12`                                    | bcrypt cost factor (10–14)                                |
| `LOG_LEVEL`          |          | `info`                                  | Pino log level                                            |

### Frontend

Copy `Frontend/.env.example` to `Frontend/.env.local` and fill in:

| Variable       | Required | Default                     | Description          |
| -------------- | -------- | --------------------------- | -------------------- |
| `VITE_API_URL` | ✅       | `http://localhost:3000/api` | Backend API base URL |

---

## API Reference

Base URL: `http://localhost:8080/api`

### REST Endpoints

#### Health

| Method | Path      | Auth | Description    |
| ------ | --------- | ---- | -------------- |
| GET    | `/health` | —    | Liveness check |

#### Auth

| Method | Path             | Auth | Description                    |
| ------ | ---------------- | ---- | ------------------------------ |
| POST   | `/auth/register` | —    | Create account, returns tokens |
| POST   | `/auth/login`    | —    | Login, returns tokens          |
| POST   | `/auth/refresh`  | —    | Rotate access + refresh tokens |
| GET    | `/auth/me`       | ✅   | Get current user profile       |
| POST   | `/auth/logout`   | ✅   | Invalidate refresh token       |

#### Tasks

| Method | Path         | Auth | Description                     |
| ------ | ------------ | ---- | ------------------------------- |
| POST   | `/tasks`     | ✅   | Create and queue a new task     |
| GET    | `/tasks`     | ✅   | List all tasks for current user |
| GET    | `/tasks/:id` | ✅   | Get task detail                 |

#### Agents

| Method | Path                    | Auth | Description                 |
| ------ | ----------------------- | ---- | --------------------------- |
| GET    | `/agents/tasks/:taskId` | ✅   | List agent steps for a task |

#### Tools

| Method | Path                   | Auth | Description                     |
| ------ | ---------------------- | ---- | ------------------------------- |
| GET    | `/tools/tasks/:taskId` | ✅   | List tool executions for a task |

#### Settings

| Method | Path        | Auth | Description               |
| ------ | ----------- | ---- | ------------------------- |
| GET    | `/settings` | ✅   | Get current user settings |
| PUT    | `/settings` | ✅   | Update settings           |

**PUT `/settings` body:**

```json
{
  "aiModel": "wind-v2.5",
  "temperature": 0.7,
  "requireToolApproval": true,
  "autonomousMode": false
}
```

---

### GraphQL

Endpoint: `POST /graphql`  
Auth: `Authorization: Bearer <accessToken>`

```graphql
# List all tasks
query {
  meTasks {
    _id
    status
    input
    result
    createdAt
  }
}

# Get single task
query {
  task(id: "...") {
    _id
    status
    result
    tokenUsage {
      totalTokens
    }
  }
}

# Create task
mutation {
  createTask(input: { input: "Research climate change trends" }) {
    _id
    status
  }
}
```

---

### Socket.IO Events

Connect to the same backend URL. Join a task room after creation:

```js
socket.emit("join_task", { taskId: "..." });
```

| Event            | Direction       | Payload                     |
| ---------------- | --------------- | --------------------------- |
| `join_task`      | Client → Server | `{ taskId }`                |
| `task_started`   | Server → Client | `{ taskId }`                |
| `agent_step`     | Server → Client | `{ taskId, agent, status }` |
| `tool_executed`  | Server → Client | `{ taskId, tool, result }`  |
| `task_completed` | Server → Client | `{ taskId, result }`        |
| `task_failed`    | Server → Client | `{ taskId, error }`         |

---

## Mobile Build

### Android

```bash
cd Frontend

# Copy web assets to Android project
ionic capacitor copy android

# Open in Android Studio
ionic capacitor open android
# Then: Build → Generate Signed Bundle/APK
```

### iOS

```bash
cd Frontend

# Add iOS platform (first time only)
ionic capacitor add ios

# Copy web assets
ionic capacitor copy ios

# Open in Xcode
ionic capacitor open ios
# Then: Product → Archive
```

---

## Security

| Measure           | Detail                                            |
| ----------------- | ------------------------------------------------- |
| Helmet            | Sets secure HTTP headers on every response        |
| CORS              | Allowlist from `ALLOWED_ORIGINS` only             |
| Rate limiting     | Applied to `POST /auth/login`                     |
| Input validation  | Zod schemas on all request payloads               |
| Auth middleware   | JWT verification on every protected route         |
| Body sanitization | Strips dangerous characters from request bodies   |
| Password hashing  | bcrypt with configurable salt rounds (default 12) |
| Token rotation    | Refresh token version bumped on logout            |

---

## Scripts Reference

### Backend

```bash
npm run dev     # Start with hot-reload (tsx watch)
npm run build   # Compile TypeScript → dist/
npm run start   # Run compiled build
npm run check   # Type-check only (no emit)
npm run seed    # Run database seed worker
```

### Frontend

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally
npm run lint         # ESLint
npm run test.unit    # Vitest unit tests
npm run test.e2e     # Cypress end-to-end tests
```

---

## Deployment

### Backend — Vercel

The `vercel.json` at `backend/vercel.json` routes all requests to `src/vercel.ts`. Deploy with:

```bash
cd backend
vercel --prod
```

Set all required environment variables in the Vercel project dashboard.

### Backend — Self-hosted

```bash
cd backend
npm run build
NODE_ENV=production node dist/server.js
```

### Frontend — Static Host (Netlify / Vercel / Firebase)

```bash
cd Frontend
npm run build
# Upload dist/ to your host
```

---

## License

MIT
