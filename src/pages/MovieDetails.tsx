import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieDetails } from "../api/tmdbApi";
import { useLanguage } from "../context/LanguageContext";
import HorizontalCastScroller from "../components/HorizontalCastScroller";
import FeaturedTrailer from "../components/FeaturedTrailer";
import { fetchSimilar, fetchRecommendations } from "../api/fetchSimilarAndRecommendations";
import HorizontalScroller from "../components/HorizontalScroller";
import { siteConfig } from "../config/siteConfig";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [movie, setMovie] = useState<any>(null);
  const [castLimit, setCastLimit] = useState(20);
  const [allCast, setAllCast] = useState<any[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    fetchMovieDetails(Number(id), language).then(setMovie);
  }, [id, language]);

  useEffect(() => {
    if (!id) return;
    fetchSimilar({ mediaType: "movie", mediaId: Number(id), language }).then(setSimilar);
    fetchRecommendations({ mediaType: "movie", mediaId: Number(id), language }).then(setRecommendations);
  }, [id, language]);

  useEffect(() => {
    if (!id) return;
    fetchMovieDetails(Number(id), language, castLimit).then((data) => {
      setMovie(data);
      setAllCast(data._allCast || []);
    });
  }, [id, language, castLimit]);

  useLayoutEffect(() => {
    function updateHeight() {
      if (leftCardRef.current) {
        setCardHeight(leftCardRef.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [movie]);

  if (!movie) return <p className="p-4">Loading...</p>;

  // Get backdrop and trailer
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : undefined;
  // Try to get YouTube trailer key from movie.videos or similar
  const youtubeId = movie.videos && movie.videos.results
    ? (movie.videos.results.find((v: any) => v.site === "YouTube" && v.type === "Trailer")?.key)
    : undefined;

  return (
    <div className="font-sans">
      {/* Featured trailer or backdrop */}
      {backdropUrl && (
        <FeaturedTrailer
          backdropUrl={backdropUrl}
          youtubeId={youtubeId}
          propsTitle={movie.title}
          propsDescription={movie.overview}
          year={movie.release_date ? movie.release_date.split("-")[0] : undefined}
          runtime={movie.runtime ? `${Math.floor(movie.runtime / 60)} hr ${movie.runtime % 60} min` : undefined}
          rating={movie.certification || movie.vote_average ? `${movie.certification ? movie.certification + ' \u00b7 ' : ''}${movie.vote_average ? movie.vote_average : ''}` : undefined}
          imdbRating={movie.imdb_rating ? movie.imdb_rating.toString() : undefined}
          director={movie.director}
          genres={movie.genres ? movie.genres.map((g: any) => g.name) : undefined}
        />
      )}
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-6 w-full items-stretch">
          {/* Left card: backdrop, name, description, type */}
          <div ref={leftCardRef} className="md:w-1/2 w-full bg-white rounded-xl shadow-lg p-6 flex flex-col items-start min-w-[320px] max-w-full overflow-y-auto scrollbar-hide" style={{maxHeight: 500}}>
            <div className="w-full h-64 rounded-xl overflow-hidden mb-4 flex-shrink-0 flex-grow-0">
              <img
                src={backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold mr-2">{movie.title}</h1>
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ml-2 ${siteConfig.buttonColors.primaryBg} ${siteConfig.buttonColors.primaryText}`}>
                Movie
              </span>
            </div>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{movie.overview}</p>
          </div>
          {/* Middle card: main details */}
          <div className="flex-1 bg-gray-50 rounded-xl shadow p-6 flex flex-col gap-2 min-w-[180px] max-w-full" style={cardHeight ? {height: cardHeight} : {}}>
            <div className="mb-2">
              <span className="font-semibold">Release Year: </span>
              {movie.release_date ? movie.release_date.split("-")[0] : "-"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">TMDB Rating: </span>
              {movie.vote_average ?? "-"}
            </div>
            {movie.director && (
              <div className="mb-2">
                <span className="font-semibold">Director: </span>
                {movie.director}
              </div>
            )}
            {movie.production_countries && movie.production_countries.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Country: </span>
                {movie.production_countries.map((c: any) => c.name).join(", ")}
              </div>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Genres: </span>
                {movie.genres.map((g: any) => g.name).join(", ")}
              </div>
            )}
            {movie.runtime && (
              <div className="mb-2">
                <span className="font-semibold">Runtime: </span>
                {Math.floor(movie.runtime / 60)}:{(movie.runtime % 60).toString().padStart(2, '0')} hours
              </div>
            )}
            {movie.certification && (
              <div className="mb-2">
                <span className="font-semibold">Certification: </span>
                {movie.certification}
              </div>
            )}
            {movie.imdb_rating && (
              <div className="mb-2">
                <span className="font-semibold">IMDB: </span>
                {movie.imdb_rating}
              </div>
            )}
          </div>
          {/* Right card: technical details */}
          <div className="flex-1 bg-gray-100 rounded-xl shadow p-6 flex flex-col gap-2 min-w-[140px] max-w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300" style={cardHeight ? {height: cardHeight} : {}}>
            {movie.tagline && (
              <div className="mb-2">
                <span className="font-semibold">Tagline: </span>
                {movie.tagline}
              </div>
            )}
            {movie.status && (
              <div className="mb-2">
                <span className="font-semibold">Status: </span>
                {movie.status}
              </div>
            )}
            {movie.budget > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Budget: </span>
                {movie.budget.toLocaleString()} $
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Revenue: </span>
                {movie.revenue.toLocaleString()} $
              </div>
            )}
            {movie.original_language && (
              <div className="mb-2">
                <span className="font-semibold">Original Language: </span>
                {movie.original_language}
              </div>
            )}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Production Companies: </span>
                {movie.production_companies.map((c: any) => c.name).join(", ")}
              </div>
            )}
            {movie.vote_count && (
              <div className="mb-2">
                <span className="font-semibold">Vote Count: </span>
                {movie.vote_count.toLocaleString()}
              </div>
            )}
            {movie.homepage && (
              <div className="mb-2">
                <span className="font-semibold">Official Website: </span>
                <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{movie.homepage}</a>
              </div>
            )}
          </div>
        </div>

        {/* Thin line between description and cast */}
        <div className="border-b border-gray-200 my-8" />

        {movie.cast && movie.cast.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Cast & Crew</h2>
            <HorizontalCastScroller
              cast={movie.cast}
              onScrollEnd={() => {
                if (movie.cast.length < allCast.length) {
                  setCastLimit((prev) => Math.min(prev + 20, allCast.length));
                }
              }}
            />
          </div>
        )}

        {/* Thin line below top cast */}
        <div className="border-b border-gray-200 my-8" />

        {/* Similar Movies */}
        <HorizontalScroller
          title="Similar"
          fetchItems={async () => similar}
          type="movie"
        />

        {/* Recommendations */}
        <HorizontalScroller
          title="Recommendations"
          fetchItems={async () => recommendations}
          type="movie"
        />
      </div>
    </div>
  );
}

export {};
