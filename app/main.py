import logging
from collections import defaultdict
from datetime import datetime, UTC
from fastapi import FastAPI, Request, Query
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app import db, chroma


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler() # Outputs logs directly to the console/stdout
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

def short_date(value: str) -> str:
    return datetime.strptime(value, "%Y-%m-%d").strftime("%b %d, %Y")

templates.env.filters["short_date"] = short_date

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(request=request, name="layout/index.html")

@app.get("/movies/search-title", response_class=HTMLResponse)
async def search_title(request: Request, title: str):
    if len(title.strip()) < 2:
        return HTMLResponse("")
    movies = db.select_movies_by_title(title)
    return templates.TemplateResponse(request=request, name="movies/movie_title.html", context={"movies": movies})

@app.get("/movies/suggest", response_class=HTMLResponse)
async def suggest_similar(request: Request, ids: list[str] = Query(None)):
    movies = db.select_movies_by_ids([int(id) for id in ids]) if ids else []
    # Use up to the first 3 watched movies, 3 suggestions each
    connections = defaultdict(list)
    for watched, similar_ids in chroma.find_similar('chroma_data', movies[:3]):
        for sid in similar_ids:
            connections[int(sid)].append(watched)
    suggested = db.select_movies_by_ids(list(connections))
    by_id = {movie.id: movie for movie in suggested}
    results = [(by_id[sid], watched) for sid, watched in connections.items() if sid in by_id]
    logger.info('suggestions for watched ids %s: %s', ids,
                {sid: [w.id for w in watched] for sid, watched in connections.items()})
    return templates.TemplateResponse(request=request, name="movies/movie_suggest.html",
                                      context={"results": results, "no_selection": not ids})
