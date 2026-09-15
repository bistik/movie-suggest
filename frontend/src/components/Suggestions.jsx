import { useMovie } from "../hooks/movie";
import SuggestionMovieCard from "./SuggestionMovieCard";
import SuggestionSkeleton from "./SuggestionSkeleton";

export default function Suggestions() {
  const { suggestMovies, isSuggesting } = useMovie();

  if (isSuggesting) {
    return <SuggestionSkeleton />;
  }

  if (suggestMovies.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto mt-10 grid w-fit grid-cols-3 gap-x-4 gap-y-6">
      {suggestMovies.map((movie) => (
        <SuggestionMovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
