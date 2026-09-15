import { formatDate, truncate } from "../utils/utils";

const POSTER_BASE = "https://image.tmdb.org/t/p/w92";

export default function MovieCard({ movie, large = false, actions = null }) {
  return (
    <div className="flex w-full items-center gap-3">
      <img
        className={`flex-shrink-0 rounded-sm object-cover ${
          large ? "h-20 w-[60px]" : "h-14 w-10"
        }`}
        src={`${POSTER_BASE}${movie.posterPath}`}
        alt={`${movie.title} poster`}
      />
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm text-neutral-100">{movie.title}</div>
        {large && (
          <div className="truncate text-xs text-neutral-400">
            {truncate(movie.overview, 100)}
          </div>
        )}
        <div className="flex gap-3 text-xs text-neutral-400">
          <span>📅 {formatDate(movie.releaseDate)}</span>
          <span>⭐ {movie.voteAverage.toFixed(2)}</span>
        </div>
      </div>
      {actions}
    </div>
  );
}
