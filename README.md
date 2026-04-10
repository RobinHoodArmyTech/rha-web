# Robin Hood Army — Web Platform

A monorepo web platform for [Robin Hood Army](https://robinhoodarmy.com) built with **Next.js 16 App Router**. It hosts three distinct applications in a single codebase:

| App | Local URL | Production Domain |
|-----|-----------|-------------------|
| **Main Site** | `localhost:3000/sites/main` | `robinhoodarmy.com` |
| **Check-In App** | `localhost:3000/sites/checkin` | `checkin.robinhoodarmy.com` |
| **Admin Console** | `localhost:3000/sites/admin` | `admin.robinhoodarmy.com` |
---

## About

### Main Site (`sites/main`)
The public-facing website for Robin Hood Army. Contains:
- **Home** — Hero slider, The Problem, The Idea, What We've Been Up To, Our Journey, How You Can Help, Our Culture, Press mentions
- **About** — Mission, Stats, FAQs, Volunteer testimonials (Robin Speak)
- **Academy** — Course catalogue with badge system (Cadet → Ninja → Gladiator → Centurion)

### Check-In App (`sites/checkin`)
A volunteer check-in portal where Robins log their drives and track badge progress. Contains:
- **Home** — Live drive stats, recent check-in photos, city highlights, active volunteers
- **Check-In Now** — Upload a drive selfie, select city, add notes
- **Dashboard** — Personal drive history and impact stats
- **My Profile** — Account and badge progress
- **City Pages** — City level pages with recent drive images as well as recent badge holder images
- **Contact Us** — Support contact form
- **Privacy Policy** — Data handling policy

### Admin Console (`sites/admin`)
Admin console for managing various data flows (i.e. food count, student enrollment, drives etc)
- **Home** - Stats and actions list
- **Academy Central** - Stats and actions list
- **Food Central** - Stats and actions list
- **City** - Stats and actions list


---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| UI Primitives | Radix UI (Dialog, Accordion, Dropdown) |
| Icons | Lucide React |
| Theme | next-themes (dark / light) |
| Font | Geist (Sans + Mono) |
| Database | PostgreSQL |
| Query Builder | Knex.js |
| Validation | Zod |

---

## Project Structure

```
robin-hood-army/
├── middleware.ts                  # Thin entry point — delegates to src/middleware/
├── knexfile.ts                   # Knex database configuration
├── next.config.ts
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx             # Root layout (ThemeProvider)
    │   ├── page.tsx               # Dev redirect → /sites/main
    │   ├── sites/
    │   │   ├── main/              # Main site pages (URL: /sites/main/*)
    │   │   │   ├── layout.tsx     # Wraps with main AppShell (Navbar + Footer)
    │   │   │   ├── page.tsx       # Home page
    │   │   │   ├── about/
    │   │   │   └── academy/
    │   │   ├── checkin/           # Check-in app pages (URL: /sites/checkin/*)
    │   │   │   ├── layout.tsx     # Wraps with CheckinAppShell (CheckinNavbar)
    │   │   │   ├── page.tsx       # Home page
    │   │   │   ├── submit/        # Drive check-in form
    │   │   │   ├── dashboard/
    │   │   │   ├── profile/
    │   │   │   ├── contact/
    │   │   │   └── privacy/
    │   │   └── admin/             # Admin Console pages (URL: /sites/admin/*)
    │   │       ├── food/          # Stats and actions for food count
    │   │       ├── academy/       # Stats and actions for students taught
    │   │       └── city/          # Stats and actions for city
    │   └── api/v1/                # API routes (file-system based)
    │       ├── auth/              # Auth endpoints (login / signup / logout)
    │       ├── checkin/           # Check-in endpoints (list / submit)
    │       └── admin/             # Admin Console endpoints
    │
    ├── domains/
    │   ├── main/
    │   │   ├── components/
    │   │   │   ├── AppShell.tsx   # Main layout shell
    │   │   │   ├── Navbar.tsx     # Main navbar (with theme toggle)
    │   │   │   ├── Footer.tsx
    │   │   │   └── auth/          # AuthModal, LoginForm, RegisterForm
    │   │   └── services/
    │   └── checkin/
    │       ├── components/
    │       │   ├── CheckinAppShell.tsx  # Checkin layout shell
    │       │   ├── CheckinNavbar.tsx    # Checkin navbar (with theme toggle)
    │       │   ├── BadgeCard.tsx        # Hexagon badge component
    │       │   └── sections/           # HeroSection, RecentCheckIns,
    │       │                           # CheckInHighlights, ActiveRobins
    │       ├── services/
    │       └── types/
    │
    ├── middleware/
    │   ├── index.ts               # Composes all middleware
    │   ├── domainResolver.ts      # Routes by hostname (main vs checkin)
    │   ├── authGuard.ts           # Protects /dashboard and /profile routes
    │   └── apiMiddlewares.ts      # withApiHandler (error handling) + withApiAuth (auth)
    │
    ├── core/
    │   ├── config/
    │   │   ├── domains.ts         # Single source of truth for domain config
    │   │   └── constants.ts       # Shared constants (frontend + backend)
    │   ├── apiResponse.ts         # ApiResponse helper + ApiError class
    │   ├── validators/            # Zod schemas (shared frontend + backend)
    │   └── db/
    │       ├── index.ts           # Singleton Knex instance
    │       └── migrations/        # Knex migration files
    │
    ├── components/
    │   └── shared/
    │       └── ThemeProvider.tsx
    │
    └── lib/
        └── utils.ts               # cn() utility
```

---

## How Routing Works

### Local Development
All pages are directly accessible by path:
```
localhost:3000/              → redirects to /sites/main
localhost:3000/sites/main    → Main home
localhost:3000/sites/checkin → Check-In app home
localhost:3000/sites/admin   → Admin Console
```

### Production (Domain-Based)
The middleware in `middleware.ts` → `src/middleware/domainResolver.ts` rewrites requests based on hostname:
```
robinhoodarmy.com/*          → internally routed to /sites/main/*
checkin.robinhoodarmy.com/*  → internally routed to /sites/checkin/*
admin.robinhoodarmy.com/*    → internally routed to /sites/admin/*
```
Configure hostnames via environment variables:
```env
NEXT_PUBLIC_MAIN_DOMAIN=robinhoodarmy.com
NEXT_PUBLIC_CHECKIN_DOMAIN=checkin.robinhoodarmy.com
NEXT_PRIVATE_ADMIN_CONSOLE_DOMAIN=admin.robinhoodarmy.com
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL

### Install dependencies
```bash
npm install
```

### Set up the database
1. Create a PostgreSQL database
2. Add `DATABASE_URL` to `.env` (see [Environment Variables](#environment-variables))
3. Run migrations:
```bash
npm run db:migrate
```

### Run development server
```bash
npm run dev
```

Then open:
- Main site: [http://localhost:3000/sites/main](http://localhost:3000/sites/main)
- Check-In app: [http://localhost:3000/sites/checkin](http://localhost:3000/sites/checkin)
- Admin Console: [http://localhost:3000/sites/admin](http://localhost:3000/sites/admin)

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Lint
```bash
npm run lint
```

---

## Environment Variables

Create a `.env` file in the root:

```env
# Domain configuration (optional — defaults shown below)
NEXT_PUBLIC_MAIN_DOMAIN=robinhoodarmy.com
NEXT_PUBLIC_CHECKIN_DOMAIN=checkin.robinhoodarmy.com
NEXT_PRIVATE_ADMIN_CONSOLE_DOMAIN=admin.robinhoodarmy.com

# Database
DATABASE_URL=postgres://user:password@localhost:5432/rha_dev
```

---

## Key Conventions

- **Domain-driven structure** — all business logic lives under `src/domains/`, split by `main`, `checkin` and `admin`
- **Route groups are not used** — pages live under `src/app/sites/main`, `src/app/sites/checkin`and `src/app/sites/admin` with explicit paths
- **Middleware is modular** — `middleware.ts` is a thin entry point; actual logic is in `src/middleware/`
- **API middlewares** — `withApiHandler` for error handling, `withApiAuth` for authentication. Composable — `withApiAuth` builds on top of `withApiHandler`
- **API responses** — use `ApiResponse.success(data)` for success, `throw new ApiError(status, message)` for errors
- **Validation** — Zod schemas in `src/core/validators/`, shared between frontend and backend
- **Database** — singleton Knex instance in `src/core/db/`. Import `db` in any API handler. Config in `knexfile.ts` at root
- **Dark mode** — managed by `next-themes`, toggled in both navbars. Default theme is `dark`
- **`suppressHydrationWarning`** on `<body>` handles browser extension attribute injection (e.g. Grammarly)
