from typing import Sequence
from app.db import Movie
import chromadb
import logging

logger = logging.getLogger(__name__)

def _get_collection(dbpath: str, collection_name: str = "tmdb"):
    client = chromadb.PersistentClient(path=dbpath)
    collection = client.get_or_create_collection(
        name=collection_name,
    )
    return collection

def _get_embeddings(dbpath: str, id: int | None) -> list[list[float]]:
    logger.info("Get embeddings for ID %s", id)
    collection = _get_collection(dbpath)
    results = collection.get(
        ids=[str(id)],
        include=["embeddings", "metadatas"]
    )
    if results["ids"] and len(results["embeddings"]) > 0:
        return results["embeddings"]
    logger.info("No embeddings found for ID %s", id)
    return [[]]

def find_similar(dbpath: str, movies: Sequence[Movie], count: int = 3) -> list[tuple[Movie, list[str]]]:
    query_embeddings = []
    origin_movies = []
    for movie in movies:
        for embedding in _get_embeddings(dbpath, movie.id):
            if len(embedding):
                query_embeddings.append(embedding)
                origin_movies.append(movie)
    if not query_embeddings:
        logger.info("No embeddings found for movies %s", movies)
        return []
    collection = _get_collection(dbpath)
    results = collection.query(
        query_embeddings=query_embeddings,
        n_results=count,
        where={
            "title": {"$nin": [movie.title for movie in movies]}
        }
    )
    if results['ids']:
        logger.debug('results distances (ID, distance) %s', list(zip(results['ids'], results['distances'])))
        return list(zip(origin_movies, results['ids']))
    logger.info("No similar movies found for movies %s", movies)
    return []
