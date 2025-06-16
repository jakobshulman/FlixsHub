import FeaturedTrailer from "../components/FeaturedTrailer";
import { fetchPopularMovies, fetchPopularMoviesByUserCountry, fetchPopularTVShows, fetchPopularTVShowsByUserCountry, fetchTopGenres } from "../api/tmdbApi";
import HorizontalScroller from "../components/HorizontalScroller";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="font-sans">
      <FeaturedTrailer type="movie" />
      <HorizontalScroller
        title="Popular Movies"
        fetchItems={() => fetchPopularMovies(language)}
        type="movie"
        onTitleClick={() => navigate("/movies")}
      />
      <HorizontalScroller
        title="Popular Movies In Your Region"
        fetchItems={() => fetchPopularMoviesByUserCountry(language)}
        type="movie"
        onTitleClick={() => navigate("/movies-by-region")}
      />
      <HorizontalScroller
        title="Popular TV Shows"
        fetchItems={() => fetchPopularTVShows(language)}
        type="tv"
        onTitleClick={() => navigate("/tvs")}
      />
      <HorizontalScroller
        title="Popular TV Shows In Your Region"
        fetchItems={() => fetchPopularTVShowsByUserCountry(language)}
        type="tv"
        onTitleClick={() => navigate("/tvs-by-region")}
      />
      <HorizontalScroller
        title="Popular Genres"
        fetchItems={() => fetchTopGenres(language)}
        type="genre"
      />
    </div>
  );
}

export {};