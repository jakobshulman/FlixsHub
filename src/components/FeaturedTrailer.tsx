import { useEffect, useState } from "react";
import { fetchPopularMovieTrailers } from "../api/tmdbApi";
import { useLanguage } from "../context/LanguageContext";

export default function FeaturedTrailer({ type }: { type: "movie" | "tv" }) {
  const { language } = useLanguage();
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularMovieTrailers(language).then((trailers) => {
      const trailer = trailers[0];
      if (trailer && trailer.trailerKey) setTrailerKey(trailer.trailerKey);
    });
  }, [type, language]);

  if (!trailerKey) return null;

  return (
    <div className="aspect-video w-full mb-6">
      <iframe
        className="w-full h-full rounded"
        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Featured Trailer"
      />
    </div>
  );
}