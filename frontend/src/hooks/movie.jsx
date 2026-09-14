import { useContext } from "react";
import { MovieProvider } from "../components/MovieProvider";

export function useMovie() {
  const context = useContext(MovieProvider);

  if (!context) {
    throw Error("Missing Movie context");
  }
  return context;
}

export function useMockTitle() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        {
          id: 1,
          title: "Jumanji",
          overview: "A movie overview",
          posterPath: "/bdHG5Mo83VPobeZZdlSz0Y7HQHB.jpg",
        },
        {
          id: 2,
          title: "Juno",
          overview: "A movie overview",
          posterPath: "/jNIn2tVhpvFD6P9IojldI3mNYcn.jpg",
        },
      ]);
      setLoading(false);
    }, 3000); // Simulates network delay

    return () => clearTimeout(timer);
  }, []);

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
