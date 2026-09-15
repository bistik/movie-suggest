import { useState } from "react";
import { MovieContext } from "./MovieContext";

export function MovieProvider({ children }) {
  const [selectMovies, setSelectMovies] = useState([]);
  const [suggestMovies, setSuggestMovies] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const addSelectMovie = (movie) => {
    setSelectMovies((prev) => [...prev, movie]);
  };
  const removeSelectMovie = (id) => {
    setSelectMovies((prev) => prev.filter((movie) => movie.id !== id));
  };
  const addSuggestMovie = (movie) => {
    setSuggestMovies((prev) => [...prev, movie]);
  };

  const values = {
    selectMovies,
    suggestMovies,
    isSuggesting,
    addSelectMovie,
    removeSelectMovie,
    setSuggestMovies,
    addSuggestMovie,
    setIsSuggesting,
  };

  return (
    <MovieContext.Provider value={values}>{children}</MovieContext.Provider>
  );
}
