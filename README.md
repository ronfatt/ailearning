## AI Learning OS

This repository contains a `teacher-led, AI-assisted tuition operating system` focused on Malaysia.

Core product rule:

- Human tutors are the primary educators.
- AI supports teaching before class, during class, and after class.
- AI must never be presented as replacing teachers.
- Student-facing AI is always linked to a tutor, class, subject, or tutor-approved study plan.

The current build now includes:

- Landing page with teacher-led platform positioning
- Tutor dashboard as the main operational surface
- Student dashboard for homework, revision, and scoped AI Study Assistant access
- Parent portal for tutor-approved progress reporting
- Admin oversight console for permissions, approvals, and AI logs
- Architecture page for schema, compliance, workflow, and roadmap

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` overview and positioning
- `/tutor` tutor dashboard and AI Teaching Copilot workflow
- `/student` student dashboard for revision and assigned work
- `/student/diagnostic` tutor-linked readiness check
- `/parent` parent transparency portal
- `/admin` admin oversight and AI logging
- `/architecture` permissions, schema, compliance, and roadmap

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL / Supabase-ready database layer

## Suggested Next Steps

1. Connect production authentication and role-based access enforcement for tutor, student, parent, and admin.
2. Replace remaining seeded content with live customer data and onboarding flows.
3. Implement billing, enrollment, and seat management for tutors and parent add-ons.
4. Add notification delivery for reports, homework, and attendance changes.
5. Complete legal, privacy, and support pages for public launch.

## Quality Checks

```bash
npm run lint
npm run build
npm run db:push
npm run db:validate
npm run db:generate
npm run db:seed
```

## Notes

This version uses seeded product data so the teacher-led workflow can be exercised while production integrations are still being connected.

Database foundation now lives in:

- `prisma/schema.prisma`
- `src/lib/platform-core.ts`
- `src/lib/approval-workflow.ts`
- `src/lib/database-blueprint.ts`
- `src/app/api/platform/blueprint/route.ts`
- `src/app/api/platform/workflow/route.ts`

Use `.env.example` as the starting point for `DATABASE_URL`.

## Supabase Connection

This app can use Supabase as the primary PostgreSQL backend without replacing the current auth and role model.

Recommended setup:

1. Use the Supabase pooled connection string for `DATABASE_URL`
2. Use the direct Supabase Postgres connection for `DIRECT_URL`
3. Keep the app runtime on `DATABASE_URL`
4. Use `DIRECT_URL` for Prisma CLI work when your network allows direct access

Example:

```bash
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"
```

If Prisma can reach your Supabase project directly, initialize with:

```bash
npm run db:push
npm run db:generate
npm run db:seed
```

If `db:push` is blocked by your local network or the current execution environment, use the checked-in SQL fallback:

1. Open the Supabase SQL Editor
2. Paste and run [`supabase/init.sql`](/Users/rms/Desktop/Ai%20Project/AiLearning/supabase/init.sql)
3. Then run locally:

```bash
npm run db:generate
npm run db:seed
```

Notes:

- This keeps the current Prisma + custom session architecture intact
- Supabase is being used here as the managed Postgres layer first
- [`supabase/init.sql`](/Users/rms/Desktop/Ai%20Project/AiLearning/supabase/init.sql) is generated from the current Prisma schema and can be used as a reliable fallback for Supabase setup
- Supabase Auth can be added later if you want to replace or complement the current auth flow

Code scaffolding now includes:

- `src/lib/supabase/config.ts`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/service-role.ts`

These utilities are intentionally additive. They do not replace the current Prisma data layer or the current app auth flow yet.

To load dashboard-ready demo data:

```bash
npm run db:setup
```

This will:

1. Push the Prisma schema into your database.
2. Generate the Prisma client.
3. Seed demo tutor workflow data aligned with the `/tutor` dashboard.

The demo seed creates:

- `Teacher Farah` as the tutor with id `tutor_farrah_01`
- `Form 5 Algebra Sprint` as the live class
- 2 lesson plan drafts in the approval queue
- 2 homework assignments in draft/approved states
- 2 parent reports in draft/approved states
