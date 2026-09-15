"""Contract tests for GET /api/v1/movie-suggestions?ids=1&ids=2&ids=3.

Response format mirrors the frontend mock data in
frontend/src/hooks/movie.jsx: movie objects with camelCase keys plus
tmdbId and watched (titles of the watched movies that produced the
suggestion).
"""

MOVIE_KEYS = {"id", "title", "overview", "posterPath", "releaseDate", "voteAverage"}
SUGGESTION_KEYS = MOVIE_KEYS | {"tmdbId", "watched"}
SUGGESTION_KEY_TYPES = {
    "id": int,
    "title": str,
    "overview": str,
    "posterPath": str,
    "releaseDate": str,
    "voteAverage": float | int,
    "tmdbId": int,
    "watched": list,
}


def test_suggestions_returns_movies_matching_contract(client):
    res = client.get("/api/v1/movie-suggestions", params=[("ids", 1), ("ids", 210), ("ids", 1042)])
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("application/json")
    suggestions = res.json()
    assert isinstance(suggestions, list)
    for suggestion in suggestions:
        assert set(suggestion.keys()) == SUGGESTION_KEYS
        for key, expected_type in SUGGESTION_KEY_TYPES.items():
            assert isinstance(suggestion[key], expected_type), key
        assert len(suggestion["watched"]) > 0
        assert all(isinstance(w, str) for w in suggestion["watched"])


def test_suggestions_do_not_include_watched_movies(client):
    res = client.get("/api/v1/movie-suggestions", params=[("ids", 210)])
    assert res.status_code == 200
    suggestions = res.json()
    watched_ids = {210}
    for suggestion in suggestions:
        assert suggestion["id"] not in watched_ids


def test_suggestions_no_ids_returns_empty_response(client):
    res = client.get("/api/v1/movie-suggestions")
    assert res.status_code == 200
    body = res.json()
    assert body is None or body == []


def test_suggestions_invalid_ids_returns_422(client):
    res = client.get("/api/v1/movie-suggestions", params=[("ids", "abc")])
    assert res.status_code == 422


def test_suggestions_missing_id_returns_empty_list(client):
    res = client.get("/api/v1/movie-suggestions", params=[("ids", 999999999)])
    assert res.status_code == 200
    assert res.json() == []
