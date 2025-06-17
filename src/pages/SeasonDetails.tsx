import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSeasonEpisodes } from '../api/fetchSeasonEpisodes';

interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  air_date: string;
}

interface SeasonDetailsProps {}

const SeasonDetails: React.FC<SeasonDetailsProps> = () => {
  const { tvId, seasonNumber } = useParams<{ tvId: string; seasonNumber: string }>();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [seasonInfo, setSeasonInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchSeasonEpisodes(Number(tvId), Number(seasonNumber));
        setSeasonInfo(data);
        setEpisodes(data.episodes || []);
      } catch (error) {
        setSeasonInfo(null);
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };
    if (tvId && seasonNumber) fetchData();
  }, [tvId, seasonNumber]);

  if (loading) return <div>טוען...</div>;
  if (!seasonInfo) return <div>לא נמצאה עונה</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header section: 2 cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-center">
        {/* Season poster as background */}
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow">
          {seasonInfo.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${seasonInfo.poster_path}`}
              alt={seasonInfo.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
              אין תמונה
            </div>
          )}
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        {/* Season description */}
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-3xl font-bold mb-4">{seasonInfo.name}</h1>
          <p className="text-gray-100 text-lg bg-black/60 rounded p-4 shadow">
            {seasonInfo.overview || 'אין תיאור לעונה זו.'}
          </p>
        </div>
      </div>
      {/* Episodes grid */}
      <h2 className="text-xl font-semibold mt-6 mb-2">פרקים</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {episodes.map((ep) => (
          <div key={ep.id} className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
            {ep.still_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                alt={ep.name}
                className="rounded mb-3 w-full h-40 object-cover"
              />
            )}
            <h3 className="text-lg font-bold mb-1">
              {ep.episode_number}. {ep.name}
            </h3>
            <p className="text-gray-500 text-sm mb-1">תאריך שידור: {ep.air_date}</p>
            <p className="text-sm flex-1">{ep.overview}</p>
          </div>
        ))}
      </div>
      {/* Back to series button */}
      <div className="flex justify-center mt-12">
        <a
          href={`/tv/${tvId}`}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
        >
          Back to Series
        </a>
      </div>
    </div>
  );
};

export default SeasonDetails;
