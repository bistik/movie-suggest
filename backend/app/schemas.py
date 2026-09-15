from pydantic import BaseModel

from app.db import Movie


class MovieOut(BaseModel):
    id: int
    title: str
    overview: str
    posterPath: str
    releaseDate: str
    voteAverage: float

    @classmethod
    def from_movie(cls, movie: Movie) -> "MovieOut":
        return cls(
            id=movie.id,
            title=movie.title,
            overview=movie.overview,
            posterPath=movie.poster_path,
            releaseDate=movie.release_date,
            voteAverage=movie.vote_average,
        )


class SuggestionOut(MovieOut):
    tmdbId: int
    watched: list[str]

    @classmethod
    def from_movie(cls, movie: Movie, watched: list[str]) -> "SuggestionOut":
        return cls(
            id=movie.id,
            title=movie.title,
            overview=movie.overview,
            posterPath=movie.poster_path,
            releaseDate=movie.release_date,
            voteAverage=movie.vote_average,
            tmdbId=movie.tmdb_id,
            watched=watched,
        )
