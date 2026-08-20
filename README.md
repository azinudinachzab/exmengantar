# The Roster

A small Next.js app for sharing a list of laid-off peers with hiring
managers and talent acquisition teams — plus a simple dashboard to add,
edit, and remove profiles.

- **`/`** — the public roster. Searchable, filterable by skill, no login
  needed. Anyone with the link can browse and reach out directly.
- **`/dashboard`** — CRUD admin. List, add (`/dashboard/new`), edit
  (`/dashboard/[id]/edit`), and delete profiles.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- A local JSON file (`data/profiles.json`) as the data store, via API
  routes at `app/api/profiles`

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) for the public
roster, and [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
to manage it. Three sample profiles are seeded in `data/profiles.json` —
feel free to delete them from the dashboard once you add your own.

## How it's put together

```
app/
  page.tsx                    Public roster (server component)
  dashboard/
    page.tsx                  Admin list + delete
    new/page.tsx               Add-profile form
    [id]/edit/page.tsx         Edit-profile form
  api/profiles/
    route.ts                   GET (list) / POST (create)
    [id]/route.ts               GET / PUT (update) / DELETE
components/
  RosterBoard.tsx              Client-side search + skill filter
  ProfileCard.tsx               Public profile card
  DashboardTable.tsx            Admin table with delete
  ProfileForm.tsx                Shared create/edit form
lib/
  types.ts                      Profile type
  db.ts                         Data-access layer (reads/writes the JSON file)
data/profiles.json              The "database"
```

Everything reads and writes through `lib/db.ts`, so the storage layer is a
single, swappable module.

## ⚠️ Before you deploy this for real

`lib/db.ts` stores data in a JSON file on disk. That's fine for local
development or a server with a persistent filesystem, but on serverless
hosts with ephemeral or read-only filesystems (e.g. a default Vercel
deployment) **writes won't persist** between requests. Before shipping this
to production, swap `lib/db.ts` for a real database — Postgres, SQLite via
Turso, Supabase, etc. The function signatures (`getProfiles`, `getProfile`,
`createProfile`, `updateProfile`, `deleteProfile`) are written so that's a
drop-in replacement; nothing else in the app needs to change.

Also worth adding before sharing the dashboard link widely: authentication
on the `/dashboard` routes and the `/api/profiles` write endpoints (there's
currently none — anyone with the URL can edit or delete profiles), and a
privacy check-in with each person before publishing their info publicly.

## Customizing

- **Fields** — edit `Profile` in `lib/types.ts`, then the form in
  `components/ProfileForm.tsx` and the card in `components/ProfileCard.tsx`.
- **Design tokens** — colors, type, and the "roster number" motif live in
  `app/globals.css` and `app/layout.tsx`.
