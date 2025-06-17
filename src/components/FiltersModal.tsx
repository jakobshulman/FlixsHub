import React, { useState, useEffect, useRef } from "react";
import { useGenres } from "../context/GenresContext";
import { useLanguage } from "../context/LanguageContext";
import GenreSelector from "./GenreSelector";

export interface Filters {
  selectedGenres: number[];
  minRating: number;
  maxRating: number;
  year?: number;
  sortBy: string;
  language: string;
}

interface FiltersModalProps {
  initialFilters: Filters;
  type: "movie" | "tv";
  onApply: (filters: Filters) => void;
  onClose: () => void;
}

export default function FiltersModal({ initialFilters, type, onApply, onClose }: FiltersModalProps) {
  const { genres } = useGenres();
  const { languages } = useLanguage();
  const [selectedGenres, setSelectedGenres] = useState<number[]>(initialFilters.selectedGenres);
  const [minRating, setMinRating] = useState<number>(initialFilters.minRating);
  const [maxRating, setMaxRating] = useState<number>(initialFilters.maxRating);
  const [year, setYear] = useState<number | undefined>(initialFilters.year);
  const [sortBy, setSortBy] = useState<string>(initialFilters.sortBy);
  const [language, setLanguage] = useState<string>(initialFilters.language ?? ""); // ברירת מחדל: כל השפות
  const modalRef = useRef<HTMLDivElement>(null);

  // סגירה ב-ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // מיקוד אוטומטי
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleReset = () => {
    setSelectedGenres([]);
    setMinRating(0);
    setMaxRating(10);
    setYear(undefined);
    setSortBy("popularity.desc");
    setLanguage(languages[0]?.iso_639_1 || "en");
  };

  const handleApply = () => {
    onApply({ selectedGenres, minRating, maxRating, year, sortBy, language });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadein"
      tabIndex={-1}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl border w-full max-w-xl p-8 animate-slideup focus:outline-none"
        tabIndex={0}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none"
          onClick={onClose}
          aria-label="סגור סינון"
        >
          ×
        </button>
        <h3 className="text-2xl font-bold mb-6 text-center">סינון תוצאות</h3>
        <div className="mb-4">
          <div className="mb-2 text-sm font-semibold text-gray-700 text-center">בחר ז'אנרים מועדפים (ניתן לבחור יותר מאחד):</div>
          <GenreSelector genres={genres} selected={selectedGenres} onChange={setSelectedGenres} color="blue" />
          <button
            onClick={handleReset}
            className="block mx-auto mt-2 text-xs text-red-500 underline hover:text-red-700"
            tabIndex={0}
          >
            איפוס הכל
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-600 mb-1">דירוג מינימלי (0-10):</span>
            <input
              type="number"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              placeholder="דירוג מינימלי"
              min={0}
              max={10}
              step={0.1}
              className="w-36 px-3 py-2 rounded-lg border-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              tabIndex={0}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-600 mb-1">דירוג מקסימלי (0-10):</span>
            <input
              type="number"
              value={maxRating}
              onChange={(e) => setMaxRating(Number(e.target.value))}
              placeholder="דירוג מקסימלי"
              min={0}
              max={10}
              step={0.1}
              className="w-36 px-3 py-2 rounded-lg border-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              tabIndex={0}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-600 mb-1">שנה (אופציונלי):</span>
            <input
              type="number"
              value={year || ""}
              onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="שנה"
              className="w-28 px-3 py-2 rounded-lg border-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              tabIndex={0}
            />
          </div>
        </div>
        <div className="mb-4">
          <span className="text-xs text-gray-600 mb-1">שפה:</span>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            tabIndex={0}
          >
            {languages.map(lang => (
              <option key={lang.iso_639_1} value={lang.iso_639_1}>
                {lang.english_name} {lang.name !== lang.english_name ? `(${lang.name})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2 text-sm font-semibold text-gray-700 text-center">מיין לפי:</div>
        <div className="flex gap-2 justify-center mb-2">
          { [
            { label: "פופולריות", value: "popularity.desc", desc: "סדר לפי פופולריות" },
            { label: "דירוג", value: "vote_average.desc", desc: "סדר לפי דירוג גולשים" },
            { label: "שנה", value: type === "movie" ? "primary_release_date.desc" : "first_air_date.desc", desc: "סדר לפי שנה" }
          ].map(({ label, value, desc }) => (
            <button
              key={value}
              onClick={() => setSortBy(value)}
              className={`px-4 py-1 rounded-full border-2 transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                sortBy === value
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
              tabIndex={0}
              title={desc}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className="block mx-auto mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition"
          onClick={handleApply}
        >
          אישור
        </button>
      </div>
      <style>{`
        .animate-fadein { animation: fadein 0.2s; }
        .animate-slideup { animation: slideup 0.3s cubic-bezier(.4,2,.6,1) both; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideup { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
