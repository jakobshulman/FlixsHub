import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieDetails } from "../api/tmdbApi";
import { useLanguage } from "../context/LanguageContext";
import HorizontalCastScroller from "../components/HorizontalCastScroller";
import FullCastGrid from "../components/FullCastGrid";
import FeaturedTrailer from "../components/FeaturedTrailer";
import { fetchSimilar, fetchRecommendations } from "../api/fetchSimilarAndRecommendations";
import HorizontalScroller from "../components/HorizontalScroller";

type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [movie, setMovie] = useState<any>(null);
  const [showFullCast, setShowFullCast] = useState(false);
  const [fullCast, setFullCast] = useState<CastMember[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchMovieDetails(Number(id), language).then(setMovie);
  }, [id, language]);

  useEffect(() => {
    if (!id) return;
    fetchSimilar({ mediaType: "movie", mediaId: Number(id), language }).then(setSimilar);
    fetchRecommendations({ mediaType: "movie", mediaId: Number(id), language }).then(setRecommendations);
  }, [id, language]);

  const handleShowFullCast = async () => {
    if (!id) return;
    try {
      // שימוש בפונקציה מה-API במקום קריאת axios ישירה
      const res = await fetchMovieDetails(Number(id), language);
      setFullCast(res.cast);
      setShowFullCast(true);
    } catch (err) {
      console.error("Failed to fetch full cast:", err);
    }
  };

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
          rating={movie.certification || movie.vote_average ? `${movie.certification ? movie.certification + ' · ' : ''}${movie.vote_average ? movie.vote_average : ''}` : undefined}
          imdbRating={movie.imdb_rating ? movie.imdb_rating.toString() : undefined}
          director={movie.director}
          genres={movie.genres ? movie.genres.map((g: any) => g.name) : undefined}
        />
      )}
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="rounded w-full md:w-1/3 h-[270px] object-cover"
            />
          ) : (
            <div className="glyphicons_v2 picture grey poster no_image_holder w-full md:w-1/3 h-[270px] rounded flex items-center justify-center text-gray-400 text-4xl bg-gray-200"></div>
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-600 mb-2">
              Year: {movie.release_date.split("-")[0]}
            </p>
            <p className="text-gray-600 mb-2">Rating: {movie.vote_average}</p>
            <p className="mt-4">{movie.overview}</p>
            {movie.director && (
              <p className="mt-4 text-gray-700">
                <strong>Director:</strong> {movie.director}
              </p>
            )}
          </div>
        </div>

        {/* קו דק בין תיאור לקאסט */}
        <div className="border-b border-gray-200 my-8" />

        {movie.cast && movie.cast.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Top Cast</h2>
            {!showFullCast ? (
              <HorizontalCastScroller cast={movie.cast} onShowAll={handleShowFullCast} />
            ) : (
              <FullCastGrid cast={fullCast} />
            )}
          </div>
        )}

        {/* קו דק מתחת לטופ קאסט */}
        <div className="border-b border-gray-200 my-8" />

        {/* דומים */}
        <HorizontalScroller
          title="דומים"
          fetchItems={async () => similar}
          type="movie"
        />

        {/* המלצות */}
        <HorizontalScroller
          title="המלצות"
          fetchItems={async () => recommendations}
          type="movie"
        />
      </div>
    </div>
  );
}

export {};
