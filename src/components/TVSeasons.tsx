import React, { useState } from "react";
import { fetchSeasonEpisodes } from "../api/fetchSeasonEpisodes";
import { siteConfig } from "../config/siteConfig";

interface TVSeasonsProps {
  showId: number;
  language: string;
  seasons: any[];
}

const TVSeasons: React.FC<TVSeasonsProps> = ({ showId, language, seasons }) => {
  const [selectedSeason, setSelectedSeason] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [seasonLoading, setSeasonLoading] = useState(false);

  const handleSeasonClick = async (season: any) => {
    setSelectedSeason(season);
    setSeasonLoading(true);
    try {
      const data = await fetchSeasonEpisodes(showId, season.season_number, language);
      setEpisodes(data.episodes || []);
    } catch (e) {
      setEpisodes([]);
    }
    setSeasonLoading(false);
  };

  if (!seasons || seasons.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">עונות</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {seasons.map((season: any) => (
          <button
            key={season.id}
            className={`px-3 py-1 rounded border transition ${selectedSeason?.id === season.id
              ? `${siteConfig.buttonColors.primaryBg} ${siteConfig.buttonColors.primaryHover} ${siteConfig.buttonColors.primaryText} ${siteConfig.buttonColors.primaryBorder}`
              : siteConfig.buttonColors.secondaryBg}`}
            onClick={() => handleSeasonClick(season)}
          >
            {season.name}
          </button>
        ))}
      </div>
      {seasonLoading && <div>טוען פרקים...</div>}
      {selectedSeason && !seasonLoading && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            {selectedSeason.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w185${selectedSeason.poster_path}`}
                alt={selectedSeason.name}
                className="rounded w-24 h-36 object-cover"
              />
            )}
            <div>
              <h3 className="text-lg font-bold mb-2">{selectedSeason.name} - פרקים</h3>
              {selectedSeason.overview && <div className="text-gray-700 mb-2">{selectedSeason.overview}</div>}
              {typeof selectedSeason.vote_average === 'number' && <div className="text-sm text-gray-600">דירוג עונה: {selectedSeason.vote_average}</div>}
            </div>
          </div>
          <ul className="space-y-2">
            {episodes.map((ep: any) => (
              <li key={ep.id} className="border rounded p-2 bg-gray-50 flex gap-4">
                {ep.still_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${ep.still_path}`}
                    alt={ep.name}
                    className="rounded w-24 h-16 object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-semibold">{ep.episode_number}. {ep.name}</div>
                  <div className="text-sm text-gray-600 mb-1">{ep.overview}</div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    {ep.air_date && <span>תאריך שידור: {ep.air_date}</span>}
                    {typeof ep.vote_average === 'number' && <span>דירוג: {ep.vote_average}</span>}
                    {ep.guest_stars && ep.guest_stars.length > 0 && (
                      <span>אורחים: {ep.guest_stars.map((g: any) => g.name).join(", ")}</span>
                    )}
                    {ep.crew && ep.crew.filter((c: any) => c.job === 'Director').length > 0 && (
                      <span>במאי: {ep.crew.filter((c: any) => c.job === 'Director').map((d: any) => d.name).join(", ")}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
            {episodes.length === 0 && <li>אין פרקים להצגה.</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TVSeasons;
