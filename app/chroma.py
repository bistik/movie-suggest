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

def _get_embeddings(dbpath: str, id: int | None):
    collection = _get_collection(dbpath)
    results = collection.get(
        ids=[str(id)],
        include=["embeddings", "metadatas"]
    )
    if results["ids"] and len(results["embeddings"]) > 0:
        return results["embeddings"]
    logger.info("No embeddings found for ID %s", id)

def find_similar(dbpath: str, movie: Movie, count: int = 3):
    embeddings = _get_embeddings(dbpath, movie.id)
    collection = _get_collection(dbpath)
    if embeddings is not None and len(embeddings) > 0:
        results = collection.query(
            query_embeddings=embeddings,
            n_results=count,
            where={
                "title": {"$ne": movie.title}
            }
        )
        if results['ids']:
            logger.debug('results distances (ID, distance) %s', list(zip(results['ids'], results['distances'])))
            return results['ids']
    logger.info("No embeddings found for movie %s", movie)
