import React from "react";
import CastMemberCard from "./CastMemberCard";

interface HorizontalCastScrollerProps {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
  onShowAll: () => void;
}

const HorizontalCastScroller: React.FC<HorizontalCastScrollerProps> = ({ cast, onShowAll }) => (
  <div className="flex overflow-x-auto gap-4 pb-2 relative scrollbar-hide">
    {cast.map((actor) => (
      <CastMemberCard key={actor.id} actor={actor} />
    ))}
    <div className="flex flex-col items-center justify-center min-w-[120px]">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mb-1"
        onClick={onShowAll}
        aria-label="Show all cast"
      >
        <span className="text-2xl">→</span>
      </button>
      <span className="text-xs text-center">אני רוצה לראות עוד</span>
    </div>
  </div>
);

export default HorizontalCastScroller;
