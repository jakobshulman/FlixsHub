import React from "react";
import { Link } from "react-router-dom";

interface CastMemberProps {
  actor: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  };
}

const CastMemberCard: React.FC<CastMemberProps> = ({ actor }) => (
  <div className="text-center min-w-[120px]">
    <Link to={`/person/${actor.id}`}>
      {actor.profile_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
          alt={actor.name}
          className="rounded-2xl mb-2 mx-auto w-[120px] h-[180px] object-cover hover:shadow-lg transition cursor-pointer"
        />
      ) : (
        <div className="w-[120px] h-[180px] bg-gray-300 rounded-2xl mb-2 mx-auto cursor-pointer" />
      )}
    </Link>
    <p className="font-medium whitespace-nowrap text-sm">{actor.name}</p>
    <p className="text-xs text-gray-600 whitespace-nowrap">as {actor.character}</p>
  </div>
);

export default CastMemberCard;
