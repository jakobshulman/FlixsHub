import React from "react";
import { siteConfig } from "../config/siteConfig";

interface GenreSelectorProps {
  genres: { id: number; name: string }[];
  selected: number[];
  onChange: (ids: number[]) => void;
  color?: "yellow" | "blue";
}

const colorMap: Record<string, string> = {
  yellow: `focus:ring-yellow-400 ${siteConfig.buttonColors.primaryBg} ${siteConfig.buttonColors.primaryText} ${siteConfig.buttonColors.primaryBorder}`,
  blue: "focus:ring-blue-400 bg-blue-300 text-gray-900 border-blue-400",
  // ניתן להוסיף צבעים נוספים
};

export default function GenreSelector({ genres, selected, onChange, color = "yellow" }: GenreSelectorProps) {
  const handleToggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((gid) => gid !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectedClass = colorMap[color] || colorMap.yellow;

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-1">
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => handleToggle(genre.id)}
          className={`px-4 py-1 rounded-full border-2 transition text-sm font-medium focus:outline-none ${selected.includes(genre.id)
            ? selectedClass
            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-50"}`}
          tabIndex={0}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
