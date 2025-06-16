import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTVDetails } from "../api/tmdbApi";
import HorizontalCastScroller from "../components/HorizontalCastScroller";
import FullCastGrid from "../components/FullCastGrid";
import { useLanguage } from "../context/LanguageContext";

export default function TVDetails() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullCast, setShowFullCast] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchTVDetails(Number(id), language)
      .then(data => {
        setShow(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load TV show details");
        setLoading(false);
      });
  }, [id, language]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!show) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {show.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
            alt={show.name}
            className="rounded w-full md:w-1/3 h-[270px] object-cover"
          />
        ) : (
          <div className="glyphicons_v2 picture grey poster no_image_holder w-full md:w-1/3 h-[270px] rounded flex items-center justify-center text-gray-400 text-4xl bg-gray-200"></div>
        )}
        <div>
          <h1 className="text-3xl font-bold mb-2">{show.name}</h1>
          <p className="mb-2 text-gray-700">{show.overview}</p>
          <div className="mb-2">
            <span className="font-semibold">Genres: </span>
            {show.genres?.map((g: any) => g.name).join(", ")}
          </div>
          <div className="mb-2">
            <span className="font-semibold">First Air Date: </span>
            {show.first_air_date}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Rating: </span>
            {show.vote_average}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Director: </span>
            {show.director || "N/A"}
          </div>
        </div>
      </div>
      {show.cast && show.cast.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Top Cast</h2>
          {!showFullCast ? (
            <HorizontalCastScroller cast={show.cast} onShowAll={() => setShowFullCast(true)} />
          ) : (
            <FullCastGrid cast={show.cast} />
          )}
        </div>
      )}
    </div>
  );
}
