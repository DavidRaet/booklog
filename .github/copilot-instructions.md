## Quick orientation — what this repo is

- Two-folder monorepo: `frontend/` (React + Vite) and `server/` (Express API). The frontend talks to the backend over HTTP at `http://localhost:3001/api`.
- Data is in-memory on the server (see `server/books.js`). Restarting the server resets data.

## Key files to inspect first

- `server/index.js` — all API routes live here. Look here for route behavior and response shapes.
- `server/BookSchema.js` — Zod schema for a Book (id is a UUID). Use this to understand validation rules and required fields.
- `server/books.js` — initial in-memory dataset; books are simple objects with `id, title, author, genre, rating, review`.
- `frontend/src/services/bookService.js` — client-side wrapper used by the UI. Shows concrete fetch calls, error behavior, and the API base URL.
- `frontend/package.json` / `server/package.json` — scripts and deps for running each side.

## Architecture and data flow (short)

- Frontend (Vite + React) makes fetch requests to `http://localhost:3001/api/books`.
- Backend is a minimal Express app exposing REST endpoints: GET /api/books, GET /api/books/:id, POST /api/books, PUT /api/books/:id, DELETE /api/books/:id.
- Validation uses `zod` on the server and expects POST bodies without `id` (server uses `BookSchema.omit({ id: true })` for creation and assigns a UUID).

## Developer workflows & commands (Windows / pwsh)

- Run frontend dev server (fast HMR):

```powershell
cd frontend
npm install        # if not already installed
npm run dev
```

- Run backend (no `start` script provided; run Node directly from repository root):

```powershell
cd server
npm install        # if needed
node index.js
```

- Lint frontend code (ESLint):

```powershell
cd frontend
npm run lint
```

Notes: CORS is enabled on the server, so frontend and backend can run on different ports. There is no proxy configured in Vite; the frontend uses the hard-coded API URL in `bookService.js`.

## Project-specific conventions and gotchas

- ESM modules: both `package.json` files set `type: "module"` — use `import`/`export` style.
- Server uses in-memory storage. Expect nondeterministic IDs on restart (server generates new UUIDs for newly created books).
- `BookSchema` expects `id` to be a UUID string. POST requests must omit `id` (server will create it). PUT expects the full validated object (including `id`).
- `bookService.js` patterns: some methods `throw` on failure (`getAllBooks`, `getBookById`) while others `return new Error(...)` (`createBook`, `updateBook`, `deleteBook`). This inconsistency affects callers — prefer normalizing to throwing exceptions for failed HTTP responses.

## Integration points & extension hints

- To add features to the UI, modify `frontend/src/components/*` and call methods on `bookService` for network access.
- To change server validation, edit `server/BookSchema.js` (Zod) — errors are returned as `result.error.issues` in responses.
- If you add a persistent DB later, replace `books.js` and the in-memory push/splice logic in `server/index.js`.

## Examples (copy/paste friendly)

- Example: Create a book (server expects body without `id`):

```json
{
  "title": "My Book",
  "author": "An Author",
  "genre": "Fiction",
  "rating": 4.2,
  "review": "Short review text"
}
```

## Where to look for changes during debugging

- If a fetch fails, check `frontend/src/services/bookService.js` for the exact URL and error handling behavior.
- If validation is failing, inspect `server/BookSchema.js` and the server's POST/PUT handlers in `server/index.js` to see how `zod` issues are returned.

---
If any of the above is incorrect or you want a different emphasis (more test guidance, CI, or adding a start script in `server/package.json`), tell me which area to expand and I will update this file.
