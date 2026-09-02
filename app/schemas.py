from datetime import datetime
from pydantic import BaseModel


class Movie(BaseModel):
    id: int
    title: str
    tmdb_id: int
    date_release: datetime
