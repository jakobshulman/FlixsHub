import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTVDetails } from "../api/tmdbApi";
import HorizontalCastScroller from "../components/HorizontalCastScroller";
import FullCastGrid from "../components/FullCastGrid";
import { useLanguage } from "../context/LanguageContext";
import FeaturedTrailer from "../components/FeaturedTrailer";
import { fetchSimilar, fetchRecommendations } from "../api/fetchSimilarAndRecommendations";
import HorizontalScroller from "../components/HorizontalScroller";
import TVSeasons from "../components/TVSeasons";

export default function TVDetails() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullCast, setShowFullCast] = useState(false);
  const [similar, setSimilar] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

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

  useEffect(() => {
    if (!id) return;
    fetchSimilar({ mediaType: "tv", mediaId: Number(id), language }).then(setSimilar);
    fetchRecommendations({ mediaType: "tv", mediaId: Number(id), language }).then(setRecommendations);
  }, [id, language]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!show) return null;

  // Get backdrop and trailer
  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
    : show.poster_path
    ? `https://image.tmdb.org/t/p/original${show.poster_path}`
    : undefined;
  // Try to get YouTube trailer key from show.videos or similar
  const youtubeId = show.videos && show.videos.results
    ? (show.videos.results.find((v: any) => v.site === "YouTube" && v.type === "Trailer")?.key)
    : undefined;

  return (
    <div className="font-sans">
      {/* Featured trailer or backdrop */}
      {backdropUrl && (
        <FeaturedTrailer
          backdropUrl={backdropUrl}
          youtubeId={youtubeId}
          propsTitle={show.name}
          propsDescription={show.overview}
          year={show.first_air_date ? show.first_air_date.split("-")[0] : undefined}
          runtime={show.episode_run_time && show.episode_run_time.length > 0 ? `${show.episode_run_time[0]} min` : undefined}
          rating={show.certification || show.vote_average ? `${show.certification ? show.certification + ' · ' : ''}${show.vote_average ? show.vote_average : ''}` : undefined}
          imdbRating={show.imdb_rating ? show.imdb_rating.toString() : undefined}
          // cast={show.cast ? show.cast.slice(0, 3).map((c: any) => c.name) : undefined}
          director={show.director}
          genres={show.genres ? show.genres.map((g: any) => g.name) : undefined}
          // icons={...} // ניתן להוסיף אייקונים בהמשך
        />
      )}
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
        {/* קו דק בין תיאור לקאסט */}
        <div className="border-b border-gray-200 my-8" />
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
        {/* קו דק בין טופ קאסט לדומים */}
        <div className="border-b border-gray-200 my-8" />
        {/* דומים */}
        <HorizontalScroller
          title="דומים"
          fetchItems={async () => similar}
          type="tv"
        />
        {/* המלצות */}
        <HorizontalScroller
          title="המלצות"
          fetchItems={async () => recommendations}
          type="tv"
        />
        {/* עונות ופרקים */}
        <TVSeasons showId={show.id} language={language} seasons={show.seasons} />
      </div>
    </div>
  );
}
