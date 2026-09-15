import { useMovie } from "../hooks/movie";
import SuggestionMovieCard from "./SuggestionMovieCard";

export default function Suggestions() {
  const { suggestMovies } = useMovie();

  if (suggestMovies.length === 0) {
    return <div className="text-neutral-400">No suggestions yet</div>;
  }

  return (
    <div className="mx-auto mt-10 grid w-fit grid-cols-3 gap-x-4 gap-y-6">
      {suggestMovies.map((movie) => (
        <SuggestionMovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
