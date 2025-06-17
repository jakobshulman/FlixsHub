import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { useNavigate } from 'react-router-dom';

interface TVSeasonsProps {
  showId: number;
  language: string;
  seasons: any[];
}

const TVSeasons: React.FC<TVSeasonsProps> = ({ showId, language, seasons }) => {
  const navigate = useNavigate();

  if (!seasons || seasons.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Seasons</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {seasons.map((season: any) => (
          <button
            key={season.id}
            className={`px-3 py-1 rounded border transition ${siteConfig.buttonColors.secondaryBg}`}
            onClick={() => navigate(`/tv/${showId}/season/${season.season_number}`)}
            style={{ cursor: 'pointer' }}
          >
            {season.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TVSeasons;
