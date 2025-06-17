import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTVDetails } from '../api/tmdbApi';
import HorizontalCastScroller from '../components/HorizontalCastScroller';
import { useLanguage } from '../context/LanguageContext';
import FeaturedTrailer from '../components/FeaturedTrailer';
import { fetchSimilar, fetchRecommendations } from '../api/fetchSimilarAndRecommendations';
import HorizontalScroller from '../components/HorizontalScroller';
import { siteConfig } from '../config/siteConfig';

export default function TVDetails() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [castLimit, setCastLimit] = useState(20);
  const [allCast, setAllCast] = useState<any[]>([]);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchTVDetails(Number(id), language, castLimit)
      .then((data) => {
        setShow(data);
        setAllCast(data._allCast || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load TV show details');
        setLoading(false);
      });
  }, [id, language, castLimit]);

  useEffect(() => {
    if (!id) return;
    fetchSimilar({ mediaType: 'tv', mediaId: Number(id), language }).then(setSimilar);
    fetchRecommendations({ mediaType: 'tv', mediaId: Number(id), language }).then(
      setRecommendations,
    );
  }, [id, language]);

  useLayoutEffect(() => {
    function updateHeight() {
      if (leftCardRef.current) {
        setCardHeight(leftCardRef.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [show]);

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
  const youtubeId =
    show.videos && show.videos.results
      ? show.videos.results.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')?.key
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
          year={show.first_air_date ? show.first_air_date.split('-')[0] : undefined}
          runtime={
            show.episode_run_time && show.episode_run_time.length > 0
              ? `${show.episode_run_time[0]} min`
              : undefined
          }
          rating={
            show.certification || show.vote_average
              ? `${show.certification ? show.certification + ' · ' : ''}${
                  show.vote_average ? show.vote_average : ''
                }`
              : undefined
          }
          imdbRating={show.imdb_rating ? show.imdb_rating.toString() : undefined}
          // cast={show.cast ? show.cast.slice(0, 3).map((c: any) => c.name) : undefined}
          director={show.director}
          genres={show.genres ? show.genres.map((g: any) => g.name) : undefined}
          // icons={...} // ניתן להוסיף אייקונים בהמשך
        />
      )}
      <div className="p-4 font-sans">
        <div className="flex flex-col md:flex-row gap-6 w-full items-stretch">
          {/* Left card: backdrop, name, description, type */}
          <div
            ref={leftCardRef}
            className="md:w-1/2 w-full bg-white rounded-xl shadow-lg p-6 flex flex-col items-start min-w-[320px] max-w-full overflow-y-auto scrollbar-hide"
            style={{ maxHeight: 500 }}
          >
            <div className="w-full h-64 rounded-xl overflow-hidden mb-4 flex-shrink-0 flex-grow-0">
              <img src={backdropUrl} alt={show.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold mr-2">{show.name}</h1>
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ml-2 ${siteConfig.buttonColors.primaryBg} ${siteConfig.buttonColors.primaryText}`}
              >
                TV Show
              </span>
            </div>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{show.overview}</p>
          </div>
          {/* Middle card: main details */}
          <div
            className="flex-1 bg-gray-50 rounded-xl shadow p-6 flex flex-col gap-2 min-w-[180px] max-w-full"
            style={cardHeight ? { height: cardHeight } : {}}
          >
            <div className="mb-2">
              <span className="font-semibold">Release Year: </span>
              {show.first_air_date ? show.first_air_date.split('-')[0] : '-'}
            </div>
            <div className="mb-2">
              <span className="font-semibold">TMDB Rating: </span>
              {show.vote_average ?? '-'}
            </div>
            {show.director && (
              <div className="mb-2">
                <span className="font-semibold">Director: </span>
                {show.director}
              </div>
            )}
            {show.production_countries && show.production_countries.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Country: </span>
                {show.production_countries.map((c: any) => c.name).join(', ')}
              </div>
            )}
            {show.genres && show.genres.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Genres: </span>
                {show.genres.map((g: any) => g.name).join(', ')}
              </div>
            )}
            {show.episode_run_time && show.episode_run_time.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Episode Length: </span>
                {show.episode_run_time[0]} min
              </div>
            )}
            {show.certification && (
              <div className="mb-2">
                <span className="font-semibold">Certification: </span>
                {show.certification}
              </div>
            )}
            {show.imdb_rating && (
              <div className="mb-2">
                <span className="font-semibold">IMDB: </span>
                {show.imdb_rating}
              </div>
            )}
          </div>
          {/* Right card: seasons */}
          <div
            className="flex-1 bg-gray-100 rounded-xl shadow p-6 flex flex-col gap-2 min-w-[140px] max-w-full overflow-y-auto scrollbar-hide self-stretch"
            style={cardHeight ? { height: cardHeight } : {}}
          >
            {show.seasons && show.seasons.length > 0 && (
              <div className="mt-0">
                <h3 className="font-bold text-lg mb-2">Seasons</h3>
                <ul className="space-y-2">
                  {(() => {
                    // סדר עונות: כל העונות הרגילות, ואז "מיוחדים" (season_number === 0)
                    const regularSeasons = show.seasons.filter((s: any) => s.season_number !== 0);
                    const specials = show.seasons.filter((s: any) => s.season_number === 0);
                    const sortedSeasons = [...regularSeasons, ...specials];
                    return sortedSeasons.map((season: any) => (
                      <li
                        key={season.id}
                        className="bg-white rounded-lg shadow p-2 flex flex-col cursor-pointer hover:bg-gray-200 transition"
                        onClick={() => navigate(`/tv/${id}/season/${season.season_number}`)}
                      >
                        {season.poster_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${season.poster_path}`}
                            alt={season.name}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                        )}
                        <span className="font-semibold">{season.name}</span>
                        {season.air_date && (
                          <span className="text-xs text-gray-500">{season.air_date}</span>
                        )}
                        {season.episode_count && (
                          <span className="text-xs text-gray-500">
                            {season.episode_count} episodes
                          </span>
                        )}
                      </li>
                    ));
                  })()}
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* Thin line between description and cast */}
        <div className="border-b border-gray-200 my-8" />
        {show.cast && show.cast.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Cast & Crew</h2>
            <HorizontalCastScroller
              cast={show.cast}
              onScrollEnd={() => {
                if (show.cast.length < allCast.length) {
                  setCastLimit((prev) => Math.min(prev + 20, allCast.length));
                }
              }}
            />
          </div>
        )}
        {/* Thin line below top cast */}
        <div className="border-b border-gray-200 my-8" />
        {/* Similar */}
        <HorizontalScroller title="Similar" fetchItems={async () => similar} type="tv" />
        {/* Recommendations */}
        <HorizontalScroller
          title="Recommendations"
          fetchItems={async () => recommendations}
          type="tv"
        />
      </div>
    </div>
  );
}
