# PRD: Architecture & Technology Stack

## 1. Core Architecture Philosophy
This application strictly follows a modern Serverless architecture utilizing Next.js App Router. The primary goal is high performance, strict type safety, and minimal client-side JavaScript. 

## 2. Frontend Ecosystem
- **Framework:** Next.js 14/15 (App Router). 
  - *Rule:* Leverage React Server Components (RSC) heavily. Only use Client Components (`'use client'`) at the leaves of the component tree when interactivity (hooks, event listeners) is strictly required.
- **Language:** TypeScript. 
  - *Rule:* `strict: true` in `tsconfig.json`. Absolute zero tolerance for `any` types. Define specific interfaces for all database rows, component props, and API responses.
- **Styling:** Tailwind CSS.
  - *Rule:* Utilize utility classes efficiently. Use `clsx` and `tailwind-merge` for dynamic class assignment to prevent style conflicts.
- **UI Base & Primitives:** Shadcn UI (Radix UI primitives).
  - *Rule:* We use Shadcn UI strictly as a foundation for accessibility (a11y) and keyboard navigation. The AI MUST heavily modify the default Shadcn styling to match our custom B2B SaaS aesthetic defined in `0_rules.md` and `3_design.md`. Do not leave standard Shadcn styles untouched.
- **Icons:** - `lucide-react` (Primary UI navigation).
  - `@phosphor-icons/react` (Technical/Illustrative elements).
- **Date/Time Formatting:** `date-fns` (lightweight, modular).

## 3. Backend & Data Layer (BaaS)
- **Platform:** Supabase.
  - *Database:* PostgreSQL. Relational structure required.
  - *Authentication:* Supabase Auth. We will utilize Role-Based Access Control (RBAC) via custom claims or a dedicated `user_roles` table.
  - *Storage:* Supabase Storage buckets for hosting game account screenshots.
- **Supabase Integration Rule:** - Use the `@supabase/ssr` package for Next.js App Router compatibility.
  - Create utility functions to securely instantiate the Supabase client for Server Actions, Server Components, and Route Handlers.

## 4. Data Mutations & Validation
- **Mutations:** Next.js Server Actions.
  - *Rule:* Avoid traditional API routes (`/app/api/...`) unless integrating with external webhooks. All database writing (inserts, updates, deletes) must be executed via Server Actions.
- **Validation:** Zod.
  - *Rule:* Every single form submission and Server Action input MUST be validated using a Zod schema before executing any Supabase queries. This is non-negotiable for system security.

## 5. Environment & Deployment
- **Hosting:** Vercel (Optimized for Next.js caching and Edge functions).
- **Environment Variables:** - Required prefix `NEXT_PUBLIC_` only for variables that must be exposed to the browser (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). 
  - Keep sensitive keys (e.g., `SUPABASE_SERVICE_ROLE_KEY`) strictly on the server.