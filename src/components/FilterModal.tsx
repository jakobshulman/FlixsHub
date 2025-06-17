import React, { useState, useEffect } from "react";
import { FilterValues } from "./FilterBar";
import { useLanguage } from "../context/LanguageContext";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { siteConfig } from "../config/siteConfig";

interface FilterModalProps {
  initial: FilterValues;
  onApply: (values: FilterValues) => void;
  onClose: () => void;
}

export default function FilterModal({ initial, onApply, onClose }: FilterModalProps) {
  const { languages } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [yearRange, setYearRange] = useState<[number, number]>([
    initial.minYear || 1950,
    initial.maxYear || currentYear
  ]);
  // טווח דירוג
  const [ratingRange, setRatingRange] = useState<
    [number, number]
  >([
    initial.minRating || 0,
    initial.maxRating || 10
  ]);
  const [language, setLanguage] = useState(initial.language ?? ""); // ברירת מחדל: כל השפות

  // עדכון ערכים ושליחה
  const handleApply = () => {
    onApply({
      minYear: yearRange[0],
      maxYear: yearRange[1],
      language, // יכול להיות ריק = כל השפות
      minRating: ratingRange[0],
      maxRating: ratingRange[1]
    });
  };

  // מניעת גלילה של הדף כשהמודל פתוח
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed left-0 right-0 bottom-0 top-[72px] bg-black/40 z-50 flex items-start justify-center" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative max-h-[calc(100vh-72px)] overflow-y-auto mt-4" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 left-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose} aria-label="Close">×</button>
        <h3 className="text-xl font-bold mb-4 text-center">Filters</h3>
        <div className="mb-6">
          <label className="block text-sm mb-2 font-semibold">Year Range:</label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 w-10 text-center">1950</span>
            <div className="flex-1 px-2">
              <Slider
                range
                min={1950}
                max={currentYear}
                value={yearRange}
                onChange={val => setYearRange(val as [number, number])}
                allowCross={false}
                trackStyle={[{ backgroundColor: '#fde047' }]}
                handleStyle={[
                  { borderColor: '#fde047', backgroundColor: '#fde047' },
                  { borderColor: '#fde047', backgroundColor: '#fde047' }
                ]}
                railStyle={{ backgroundColor: '#e5e7eb' }}
              />
            </div>
            <span className="text-xs text-gray-500 w-10 text-center">{currentYear}</span>
          </div>
          <div className="text-center text-xs mt-1">{yearRange[0]} - {yearRange[1]}</div>
        </div>
        <div className={`${siteConfig.divider.thickness} ${siteConfig.divider.border} my-4`} />
        <div className="mb-6">
          <label className="block text-sm mb-2 font-semibold">Rating Range:</label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 w-10 text-center">{ratingRange[0]}</span>
            <div className="flex-1 px-2">
              <Slider
                range
                min={0}
                max={10}
                step={0.1}
                value={ratingRange}
                onChange={val => setRatingRange(val as [number, number])}
                allowCross={false}
                trackStyle={[{ backgroundColor: '#fde047' }]}
                handleStyle={[
                  { borderColor: '#fde047', backgroundColor: '#fde047' },
                  { borderColor: '#fde047', backgroundColor: '#fde047' }
                ]}
                railStyle={{ backgroundColor: '#e5e7eb' }}
              />
            </div>
            <span className="text-xs text-gray-500 w-10 text-center">{ratingRange[1]}</span>
          </div>
        </div>
        <div className={`${siteConfig.divider.thickness} ${siteConfig.divider.border} my-4`} />
        <div className="mb-3">
          <label className="block text-sm mb-1 font-semibold">Movie Language:</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full"
          >
            <option value="">Choose language</option>
            {languages.map(lang => (
              <option key={lang.iso_639_1} value={lang.iso_639_1}>
                {lang.english_name}
                {lang.name && lang.name !== lang.english_name ? ` (${lang.name})` : ""}
              </option>
            ))}
          </select>
        </div>
        <button className={`mt-4 w-full ${siteConfig.buttonColors.primaryBg} ${siteConfig.buttonColors.primaryHover} ${siteConfig.buttonColors.primaryText} py-2 rounded transition`} onClick={handleApply}>Apply Filter</button>
      </div>
    </div>
  );
}

// TODO: Consider merging with FiltersModal for DRY principle.
// Add prop types and comments for clarity.
