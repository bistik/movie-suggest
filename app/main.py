import logging
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

@app.get("/movies/suggest")
async def suggest_similar(ids: list[str] = Query(None)):
    # movies = db.select_movies_by_ids([int(id) for id in ids])
    movies = db.select_movies_by_ids([int(id) for id in ids])
    if movies:
        similar_ids = chroma.find_similar('chroma_data', movies[0])
    logger.warning('similar ids %s', similar_ids)
    return movies[0].title
    # logger.warning('movies %s', movies)
    # chroma.find_similar
    # return movies
