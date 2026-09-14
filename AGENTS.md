# AGENTS.md

## Layout & running

- Two independent packages, no root workspace: `backend/` (FastAPI + uv, Python 3.14) and `frontend/` (React 19 + Vite + bun). Run all commands from the respective package directory.
- Backend (from `backend/`):
  ```bash
  uv sync
  uv run fastapi dev   # entrypoint: app/main.py
  ```
- Backend via Docker (from `backend/`): `cp .env.example .env` then `docker compose up --build`. The compose file bind-mounts `./tmdbdf.db` and `./chroma_data` into `/data/`.
- Frontend (from `frontend/`): `bun install`, `bun run dev`, `bun run build`, `bun run lint` (oxlint).

## Gotchas

- Paths differ in resolution: `CHROMA_PATH` default (`chroma_data`) is **CWD-relative**, `SQLITE_PATH` default (`tmdbdf.db`) is resolved relative to `app/` source dir. Running uv from anywhere other than `backend/` can break the Chroma path — always run backend commands from `backend/`.
- `.env` is used only by Docker; local dev needs no env vars (code defaults suffice).
- `backend/tmdbdf.db` (SQLite) and `backend/chroma_data/` (ChromaDB) are gitignored prerequisites — both exist locally but have **no generation script in the repo**. The app opens them read-only; it never creates the DB (`db.create_database()` exists but is unused).
- No tests, no CI, no pre-commit config. Verification = `bun run lint` (frontend, only linter) plus booting the backend. There is no backend linter or typecheck.
- Root `.gitignore`'s unanchored `docs/` line also ignores `backend/docs/` — backend docs are untracked.

## Architecture

- Backend is a **server-rendered HTML app** (Jinja2 partials), not a JSON API: `GET /` (page), `GET /movies/search-title`, `GET /movies/suggest?ids=...` (semantic search via ChromaDB collection `tmdb`, joined back via SQLite). Static files from `backend/static/`, templates in `backend/templates/`.
- Frontend is UI scaffolding not yet connected to the backend: hooks in `src/hooks/movie.jsx` are mock implementations, SearchBar is a placeholder; no API base URL or fetch anywhere in `src/`. Tailwind v4 is wired via the `@tailwindcss/vite` Vite plugin (no tailwind config file).

## Docs

- `backend/docs/DEPLOYMENT.md` — Dokploy deploy guide, env vars, rsync of DB files to server.
- `backend/docs/TODOS.md` — UI TODOs.
