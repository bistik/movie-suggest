import { useMovie } from "../hooks/movie";
import { useMockSuggest } from "../hooks/movie";

export default function SuggestForm() {
  const { selectMovies, setSuggestMovies, setIsSuggesting } = useMovie();
  const { suggest, loading } = useMockSuggest();

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSuggesting(true);
    try {
      const movies = await suggest(selectMovies.map((movie) => movie.id));
      setSuggestMovies(movies);
    } finally {
      setIsSuggesting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 max-w-2xl px-4 text-center"
    >
      <button
        type="submit"
        disabled={selectMovies.length === 0 || loading}
        className="cursor-pointer rounded-md border border-neutral-700 bg-neutral-800 px-5 py-2.5 font-semibold text-sm text-neutral-100 shadow-sm transition-colors hover:border-teal-500 hover:text-teal-400 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-500/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-700 disabled:hover:text-neutral-100"
      >
        {loading ? "Suggesting..." : "Suggest similar movies"}
      </button>
    </form>
  );
}
