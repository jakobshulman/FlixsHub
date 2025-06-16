import React from "react";
import CastMemberCard from "./CastMemberCard";

interface FullCastGridProps {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
}

const FullCastGrid: React.FC<FullCastGridProps> = ({ cast }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
    {cast.map((actor) => (
      <CastMemberCard key={actor.id} actor={actor} />
    ))}
  </div>
);

export default FullCastGrid;
