import { useContext, useEffect, useState } from "react";
import { MovieContext } from "../components/MovieContext";

export function useMovie() {
  const context = useContext(MovieContext);

  if (!context) {
    throw Error("Missing Movie context");
  }
  return context;
}

const MOCK_MOVIES = [
  {
    id: 210,
    title: "Jurassic Park",
    overview:
      "A wealthy entrepreneur secretly creates a theme park featuring living dinosaurs drawn from prehistoric DNA.",
    posterPath: "/63viWuPfYQjRYLSZSZNq7dglJP5.jpg",
    releaseDate: "1993-06-11",
    voteAverage: 7.98,
  },
  {
    id: 3316,
    title: "The Conjuring",
    overview:
      "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
    posterPath: "/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    releaseDate: "2013-07-18",
    voteAverage: 7.54,
  },
  {
    id: 4944,
    title: "The Conjuring: The Devil Made Me Do It",
    overview:
      "Paranormal investigators Ed and Lorraine Warren encounter what would become one of the most sensational cases of their careers.",
    posterPath: "/xbSuFiJbbBWCkyCCKIMfuDCA4yV.jpg",
    releaseDate: "2021-05-25",
    voteAverage: 7.34,
  },
  {
    id: 3945,
    title: "The Conjuring 2",
    overview:
      "Lorraine and Ed Warren travel to north London to help a single mother raising four children alone in a haunted house.",
    posterPath: "/zEqyD0SBt6HL7W9JQoWwtd5Do1T.jpg",
    releaseDate: "2016-06-08",
    voteAverage: 7.29,
  },
  {
    id: 1,
    title: "Jumanji",
    overview:
      "When siblings Judy and Peter discover an enchanted jungle board game, they open a doorway to a magical world.",
    posterPath: "/bdHG5Mo83VPobeZZdlSz0Y7HQHB.jpg",
    releaseDate: "1995-12-15",
    voteAverage: 7.1,
  },
  {
    id: 2,
    title: "Juno",
    overview:
      "Faced with an unplanned pregnancy, an offbeat young woman makes an unusual decision regarding her unborn child.",
    posterPath: "/jNIn2tVhpvFD6P9IojldI3mNYcn.jpg",
    releaseDate: "2007-12-07",
    voteAverage: 7.11,
  },
];

function filterMovies(query) {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) {
    return null;
  }
  return MOCK_MOVIES.filter((movie) =>
    movie.title.toLowerCase().includes(needle),
  );
}

export function useMockTitle(query) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setData(filterMovies(trimmed));
      setLoading(false);
    }, 300); // Simulates network delay

    return () => clearTimeout(timer);
  }, [query]);

  return { data, loading };
}

export function useMockSuggest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        {
          id: 3,
          title: "Gone Baby Gone",
          overview: "A movie overview",
          posterPath: "/5BXDhjKZ4AL9VPxcygdG3oL60GP.jpg",
        },
        {
          id: 4,
          title: "Footloose",
          overview: "A movie overview",
          posterPath: "/cDUW5RWmyHcTxu7eg9eMqhBQy2J.jpg",
        },
      ]);
      setLoading(false);
    }, 3000); // Simulates network delay

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}
