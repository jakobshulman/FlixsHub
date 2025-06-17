import React, { useState } from "react";
import { useGenres } from "../context/GenresContext";
import GenreSelector from "./GenreSelector";

interface GenresModalProps {
  selected: number[];
  onApply: (ids: number[]) => void;
  onClose: () => void;
}

export default function GenresModal({ selected, onApply, onClose }: GenresModalProps) {
  const { genres } = useGenres();
  const [chosen, setChosen] = useState<number[]>(selected);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 left-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose} aria-label="סגור">×</button>
        <h3 className="text-xl font-bold mb-4 text-center">בחר ז'אנרים</h3>
        <GenreSelector genres={genres} selected={chosen} onChange={setChosen} color="yellow" />
        <button className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-900 py-2 rounded transition" onClick={() => onApply(chosen)}>אישור</button>
      </div>
    </div>
  );
}
