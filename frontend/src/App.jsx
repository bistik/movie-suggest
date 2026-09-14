import Heading from "./components/Heading";
import { MovieProvider } from "./components/MovieProvider";
import SearchBar from "./components/SearchBar";
import SelectedArea from "./components/SelectedArea";
import SuggestForm from "./components/SuggestForm";
import Suggestions from "./components/Suggestions";

function App() {
  return (
    <MovieProvider>
      <Heading />
      <SearchBar />
      <SelectedArea />
      <SuggestForm />
      <Suggestions />
    </MovieProvider>
  );
}

export default App;
