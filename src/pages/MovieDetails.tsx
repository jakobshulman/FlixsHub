import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieDetails } from "../api/tmdbApi";
import { useLanguage } from "../context/LanguageContext";
import HorizontalCastScroller from "../components/HorizontalCastScroller";
import FullCastGrid from "../components/FullCastGrid";

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

  useEffect(() => {
    if (!id) return;
    fetchMovieDetails(Number(id), language).then(setMovie);
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

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans">
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
    </div>
  );
}

export {};
