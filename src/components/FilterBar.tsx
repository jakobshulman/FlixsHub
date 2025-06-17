import React from "react";
import SortDropdown from "./SortDropdown";
import FilterModal from "./FilterModal";
import GenresModal from "./GenresModal";

interface FilterBarProps {
  sort: string;
  onSortChange: (value: string) => void;
  filter: FilterValues;
  onFilterChange: (values: FilterValues) => void;
  genres: number[];
  onGenresChange: (ids: number[]) => void;
}

export interface FilterValues {
  selectedGenres?: number[];
  minRating?: number;
  maxRating?: number;
  minYear?: number;
  maxYear?: number;
  sortBy?: string;
  language?: string;
}

export default function FilterBar({ sort, onSortChange, filter, onFilterChange, genres, onGenresChange }: FilterBarProps) {
  const [showFilter, setShowFilter] = React.useState(false);
  const [showGenres, setShowGenres] = React.useState(false);

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center py-4 bg-white border-b sticky top-0 z-40">
      <SortDropdown value={sort} onChange={onSortChange} />
      <button
        className="px-4 py-2 bg-gray-100 rounded-full border hover:bg-gray-200 transition"
        onClick={() => setShowFilter(true)}
      >
        פילטר
      </button>
      <button
        className="px-4 py-2 bg-gray-100 rounded-full border hover:bg-gray-200 transition"
        onClick={() => setShowGenres(true)}
      >
        ז'אנרים
      </button>
      {showFilter && (
        <FilterModal
          initial={filter}
          onApply={(vals: FilterValues) => { onFilterChange(vals); setShowFilter(false); }}
          onClose={() => setShowFilter(false)}
        />
      )}
      {showGenres && (
        <GenresModal
          selected={genres}
          onApply={(ids: number[]) => { onGenresChange(ids); setShowGenres(false); }}
          onClose={() => setShowGenres(false)}
        />
      )}
    </div>
  );
}
