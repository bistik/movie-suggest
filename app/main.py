from datetime import datetime, UTC
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app import db


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

def short_date(value: str) -> str:
    return datetime.strptime(value, "%Y-%m-%d").strftime("%b %d, %Y")

templates.env.filters["short_date"] = short_date

movies: list[dict] = [
    {
        'id': 1,
        'title': 'Kill Bill',
        'tmdb_id': 101,
        'date_release': datetime.now(UTC)
    }
]

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(request=request, name="layout/index.html")

@app.get("/movies/search-title", response_class=HTMLResponse)
async def search_title(request: Request, title: str):
    if len(title.strip()) < 2:
        return HTMLResponse("")
    movies = db.select_movies_by_title(title)
    return templates.TemplateResponse(request=request, name="movies/movie_title.html", context={"movies": movies})
