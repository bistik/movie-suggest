import { createContext, useState } from "react";

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [selectMovies, setSelectMovies] = useState([]);
  const [suggestMovies, setSuggestMovies] = useState([]);
  const addSelectMovie = (movie) => {
    setSelectMovies((prev) => [...prev, movie]);
  };
  const addSuggestMovie = (movie) => {
    setSuggestMovies((prev) => [...prev, movie]);
  };

  const values = {
    selectMovies,
    suggestMovies,
    addSelectMovie,
    addSuggestMovie,
  };

  return (
    <MovieContext.Provider value={values}>{children}</MovieContext.Provider>
  );
}
