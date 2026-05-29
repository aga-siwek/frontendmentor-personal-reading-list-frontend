# Personal Reading List — Frontend

A full-stack reading tracker built as a Frontend Mentor challenge. Users can manage their book collection, track reading progress, organize books into custom shelves, and set yearly reading goals.

**Live demo:** https://frontendmentor-personal-reading-lis.vercel.app  
**Backend repo:** https://github.com/aga-siwek/frontendmentor-personal-reading-list

---

## Features

- **Authentication** — register, login, JWT-based session with auto-redirect
- **Book search** — search Open Library by title/author with session-cached results
- **Shelf management** — built-in shelves (All, Currently Reading, Want to Read, Read, Favorites) and custom user shelves
- **Reading progress** — page tracking with percentage, notes, and star ratings
- **Reading goal** — set and track a yearly book goal with live progress
- **Responsive design** — mobile tab navigation, desktop sidebar layout

## Tech Stack

| Area | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build tool | Vite |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| HTTP client | Axios |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Base UI) |
| Toasts | Sonner |
| Icons | Lucide React |
| Deployment | Vercel |

## Architecture highlights

- **Optimistic updates** — shelf and status changes are reflected instantly in the UI before the server confirms, with rollback on error
- **Query-based state** — no global state manager; all server data lives in TanStack Query cache
- **Session search history** — recent searches are cached in memory to avoid redundant API calls
- **Type-safe API layer** — dedicated API modules with typed responses; all shared types in a single `types/index.ts`

## Project structure

```
src/
├── api/          # Axios API calls (auth, books, shelves, goal)
├── components/   # UI components (sidebar, book cards, layout)
├── lib/          # Axios client, utilities
├── pages/        # Route-level page components
├── queries/      # TanStack Query hooks
└── types/        # Shared TypeScript interfaces
```

## Running locally

```bash
npm install
npm run dev
```

The app points to the production backend by default. To use a local backend, update `baseURL` in `src/lib/axiosClient.ts`.

## Related

- [Backend repository](https://github.com/aga-siwek/frontendmentor-personal-reading-list) — Python / Flask REST API with PostgreSQL
