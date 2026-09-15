import { useEffect, useRef, useState } from "react";
import { useMockTitle } from "../hooks/movie";

const POSTER_BASE = "https://image.tmdb.org/t/p/w92";

function formatDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

function truncate(text, length = 120) {
  return text.length > length ? `${text.slice(0, length).trimEnd()}...` : text;
}

function SuggestionItem({ movie, active, onMouseDown, onMouseEnter }) {
  return (
    <li
      className={`flex items-center gap-3 border-b border-neutral-700/50 px-3 py-2 ${
        active ? "bg-neutral-700/60" : ""
      }`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      <img
        className="h-14 w-10 flex-shrink-0 rounded-sm object-cover"
        src={`${POSTER_BASE}${movie.posterPath}`}
        alt={`${movie.title} poster`}
      />
      <div className="min-w-0">
        <div className="font-medium text-sm text-neutral-100">{movie.title}</div>
        <div className="truncate text-xs text-neutral-400">
          {truncate(movie.overview)}
        </div>
        <div className="flex gap-3 text-xs text-neutral-400">
          <span>📅 {formatDate(movie.releaseDate)}</span>
          <span>⭐ {movie.voteAverage.toFixed(2)}</span>
        </div>
      </div>
    </li>
  );
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const { data, loading } = useMockTitle(query);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleChange = (event) => {
    setActiveIndex(0);
    setQuery(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (!data || data.length === 0) {
      if (event.key === "Escape") setOpen(false);
      return;
    }
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % data.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + data.length) % data.length);
        break;
      case "Enter":
        selectMovie(data[activeIndex]);
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  // Placeholder selection handler; SelectedArea integration comes later.
  function selectMovie(movie) {
    if (!movie) return;
    setOpen(false);
    setQuery(movie.title);
  }

  return (
    <div ref={containerRef} className="relative mx-auto max-w-md px-4">
      <input
        type="text"
        name="title"
        autoComplete="off"
        placeholder="Find a movie by title"
        value={query}
        className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100 text-sm placeholder-neutral-500 focus:border-teal-500 focus:outline-hidden"
        onFocus={() => setOpen(true)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {open && (loading || data !== null) && (
        <ul className="absolute inset-x-4 top-full z-10 mt-1 max-h-80 divide-y divide-neutral-700/50 overflow-y-auto rounded-md border border-neutral-700 bg-neutral-800 shadow-lg">
          {loading && (
            <li className="flex items-center justify-center gap-2 px-3 py-2 text-neutral-400 text-sm">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-500 border-t-teal-500" />
              Searching...
            </li>
          )}
          {!loading && data !== null && data.length === 0 && (
            <li className="px-3 py-2 text-neutral-400 text-sm">
              No movies found
            </li>
          )}
          {!loading &&
            data !== null &&
            data.map((movie, index) => (
              <SuggestionItem
                key={movie.id}
                movie={movie}
                active={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectMovie(movie);
                }}
              />
            ))}
        </ul>
      )}
    </div>
  );
}
