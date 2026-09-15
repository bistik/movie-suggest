"""Contract tests for GET /api/v1/movies?q=<title>.

The response format mirrors the frontend mock data in
frontend/src/hooks/movie.jsx: an array of movie objects with camelCase keys.
"""

MOVIE_KEYS = {"id", "title", "overview", "posterPath", "releaseDate", "voteAverage"}
MOVIE_KEY_TYPES = {
    "id": int,
    "title": str,
    "overview": str,
    "posterPath": str,
    "releaseDate": str,
    "voteAverage": float | int,
}


def test_search_returns_movies_matching_contract(client):
    res = client.get("/api/v1/movies", params={"q": "jurassic"})
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("application/json")
    movies = res.json()
    assert isinstance(movies, list)
    assert len(movies) > 0
    for movie in movies:
        assert set(movie.keys()) == MOVIE_KEYS
        for key, expected_type in MOVIE_KEY_TYPES.items():
            assert isinstance(movie[key], expected_type), key
    assert all("jurassic" in movie["title"].lower() for movie in movies)


def test_search_empty_query_returns_empty_response(client):
    res = client.get("/api/v1/movies", params={"q": ""})
    assert res.status_code == 200
    body = res.json()
    assert body is None or body == []


def test_search_single_char_query_returns_empty_response(client):
    res = client.get("/api/v1/movies", params={"q": "j"})
    assert res.status_code == 200
    body = res.json()
    assert body is None or body == []


def test_search_no_results_returns_empty_list(client):
    res = client.get("/api/v1/movies", params={"q": "zzzznotamoviezzzz"})
    assert res.status_code == 200
    assert res.json() == []


def test_search_missing_q_param_returns_422(client):
    res = client.get("/api/v1/movies")
    assert res.status_code == 422
