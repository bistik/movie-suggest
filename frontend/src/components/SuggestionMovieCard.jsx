import { formatDate, truncate } from "../utils/utils";

const POSTER_BASE = "https://image.tmdb.org/t/p/w185";

export default function SuggestionMovieCard({ movie }) {
  return (
    <div className="flex w-56 flex-col">
      <img
        className="mb-3 h-auto w-56 rounded-sm object-cover"
        src={`${POSTER_BASE}${movie.posterPath}`}
        alt={`${movie.title} poster`}
      />
      <div className="font-medium text-lg text-neutral-100">{movie.title}</div>
      <div className="mt-1 text-sm text-neutral-400">
        {truncate(movie.overview)}
      </div>
      <div className="mt-2 flex gap-3 text-xs text-neutral-600">
        <span>⭐ {movie.voteAverage.toFixed(2)}</span>
        <span>📅 {formatDate(movie.releaseDate)}</span>
      </div>
      <a
        className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
        href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
        target="_blank"
        rel="noreferrer"
      >
        View on TMDB
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 17L17 7M9 7h8v8"
          />
        </svg>
      </a>
      <div className="mt-2 text-xs text-neutral-500">
        Because you watched: {movie.watched.join(", ")}
      </div>
    </div>
  );
}
