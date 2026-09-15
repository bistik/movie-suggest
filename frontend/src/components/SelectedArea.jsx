import MovieCard from "./MovieCard";
import { useMovie } from "../hooks/movie";

function RemoveButton({ movie, onRemove }) {
  return (
    <button
      type="button"
      aria-label={`Remove ${movie.title}`}
      onClick={() => onRemove(movie.id)}
      className="flex-shrink-0 cursor-pointer rounded-md border border-red-600 bg-red-600 px-3 py-1.5 font-bold text-sm leading-none text-white transition-colors hover:bg-red-700"
    >
      ×
    </button>
  );
}

export default function SelectedArea() {
  const { selectMovies, removeSelectMovie } = useMovie();

  return (
    <section className="mx-auto mt-8 max-w-2xl px-4">
      <h4 className="mb-2 font-semibold text-lg text-neutral-800">
        Selected movies
      </h4>
      <div className="min-h-[100px] rounded-md border border-neutral-700 bg-neutral-800 p-2">
        {selectMovies.length === 0 ? (
          <p className="px-1 py-4 text-center text-neutral-500 text-sm">
            No movies selected yet
          </p>
        ) : (
          <ul className="divide-y divide-neutral-700/50">
            {selectMovies.map((movie) => (
              <li key={movie.id} className="px-1 py-2">
                <MovieCard
                  movie={movie}
                  large
                  actions={
                    <RemoveButton
                      movie={movie}
                      onRemove={removeSelectMovie}
                    />
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
