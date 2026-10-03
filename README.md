# AI Ad Generator — AI-Based Product Advertisement Generator

A full-stack web application built as a BCA final-year project that allows users to input product specifications and generate structured, multi-channel advertisement campaigns using Generative AI.

---

## 🏗️ Architecture

```
React Frontend (Vite + Tailwind CSS)
  ↓ [REST API / JSON with JWT]
Node.js + Express.js Backend Server
  ↓
Validation & Ownership Authorization
  ↓
Prompt Construction with Factual Grounding
  ↓
Google Gemini 3.8 Flash Generative AI API
  ↓
Structured Advertisement Package
  ↓
React Result Workspace (Copy, Edit, Regenerate, Save)
  ↓
Persistent MongoDB Collection Storage (Users, Products, Advertisements)
```

---

## 📂 Project Structure

```
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite configuration
├── server.ts                   # Full-stack Express server mounting Vite in dev
├── .env.example                # Environment variables template
├── metadata.json               # AI Studio project capabilities
├── server/                     # Backend Source Code
│   ├── config/                 # Environment & JWT configuration
│   ├── controllers/            # Request handlers (auth, product, ad)
│   ├── middleware/             # Auth, validation, error handlers
│   ├── models/                 # MongoDB/JSON document schemas
│   ├── routes/                 # Express route definitions
│   ├── services/               # Gemini AI service with prompt grounding
│   └── utils/                  # Document storage engine
└── src/                        # Frontend React Source Code
    ├── components/             # Reusable UI (Navbar, Footer, ProtectedRoute)
    ├── context/                # AuthContext (JWT session management)
    ├── pages/                  # Landing, Login, Register, Dashboard,
    │                           # Products, Generator, History, AdDetail, ProjectDocs
    ├── services/               # API client service
    ├── types/                  # TypeScript interfaces
    ├── App.tsx                 # Main client router and layout
    └── main.tsx                # React root entry point
```

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create `.env` based on `.env.example`:

```bash
PORT=3000
JWT_SECRET=ai_ad_generator_super_secure_jwt_secret_2026
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
NODE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be live at `http://localhost:3000`.

### 4. Health Check Verification (Stage 1)

Test the backend health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected JSON response:
```json
{
  "status": "ok",
  "service": "AI Ad Generator API",
  "version": "1.0.0",
  "timestamp": "2026-09-28T...",
  "uptime": 12.34
}
```

---

## 🔑 Core Features & Modules

1. **Authentication (Stage 3):** User registration and login with bcrypt password hashing and JWT token authorization.
2. **Dashboard (Stage 4):** Metrics on saved campaigns, recent advertisements, quick links, and zero-data empty states.
3. **Product Catalog (Stage 5):** Full CRUD management of product specs with ownership protection.
4. **Ad Generator UI (Stage 6):** Two-column workspace with product picker and customizable tone, platform, length, and ad format.
5. **AI Integration (Stage 7):** Gemini 3.8 Flash model returning 7 structured components with strict anti-hallucination rules.
6. **Result Workspace (Stage 8):** Headline, Tagline, Short Description, Long Description, Promotional Message, CTA, and Social Copy with one-click clipboard copying and inline editing.
7. **Ad History & Storage (Stage 9):** Persistent database saving, history browsing, duplicate to generator, and deletion.
8. **Security & Validation Audit (Stage 10):** OWASP-aligned checklist ensuring password hashing, RBAC ownership checks, and secret protection.
9. **UI/UX Polish (Stage 11):** Dark-lilac theme, responsive multi-column layouts, and accessibility.
