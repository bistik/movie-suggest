Web app that suggests a movie to watch based on previously watched movies.
It uses the movie plot/summary to do a semantic search for similar movies.

## Run locally

```bash
uv sync
uv run fastapi dev
```

## Run locally with Docker

```bash
cp .env.example .env
docker compose up --build
```

Requires `tmdbdf.db` and `chroma_data/` in the repo root (gitignored).
