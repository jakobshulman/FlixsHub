import { useEffect, useState, useRef, useCallback } from "react";
import MediaCard from "./MediaCard";
import { useLanguage } from "../context/LanguageContext";
import { useCountry } from "../context/CountryContext";
import { fetchMediaList } from "../api/fetchMediaList";
import FilterBar, { FilterValues } from "./FilterBar";

interface GenericInfiniteGridProps {
  title: string;
  type: "movie" | "tv";
  getTitle?: (item: any) => string;
  byRegion?: boolean;
}

export default function GenericInfiniteGrid({ title, type, getTitle, byRegion = false }: GenericInfiniteGridProps) {
  const { language } = useLanguage();
  const { countryCode } = useCountry();

  const [items, setItems] = useState<any[]>([]);
  const [sort, setSort] = useState<string>("popularity.desc");
  const [filter, setFilter] = useState<FilterValues>({
    selectedGenres: [],
    minRating: 0,
    maxRating: 10,
    minYear: 1950,
    maxYear: new Date().getFullYear(),
    sortBy: "popularity.desc",
    language: "", // ברירת מחדל: כל השפות
  });
  const [genres, setGenres] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);
  const loadedIdsRef = useRef<Set<number>>(new Set());

  const resetState = () => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    loadedIdsRef.current = new Set();
  };

  useEffect(() => {
    // אין לעדכן את שפת האפליקציה לפי הפילטר
    resetState();
  }, [sort, filter, genres, language, byRegion, type, countryCode]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    const result = await fetchMediaList({
      type,
      language, // שפת תוצאות (UI)
      originalLanguage: filter.language || undefined, // שפת הסרט/סדרה, רק אם נבחרה בפילטר
      page,
      genreIds: filter.selectedGenres && filter.selectedGenres.length > 0 ? filter.selectedGenres : genres,
      countryCode: byRegion ? countryCode : null,
      minRating: filter.minRating,
      maxRating: filter.maxRating,
      minYear: filter.minYear,
      maxYear: filter.maxYear,
      sortBy: filter.sortBy || sort,
    });
    const seen = loadedIdsRef.current;
    const merged = result.filter((item: any) => !seen.has(item.id));
    merged.forEach((item: any) => seen.add(item.id));
    setItems((prev) => [...prev, ...merged]);
    setHasMore(merged.length > 0);
  }, [page, sort, filter, genres, language, byRegion, type, countryCode, hasMore]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    }, { threshold: 1 });

    const el = loader.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore]);

  return (
    <div className="max-w-6xl mx-auto">
      <FilterBar
        sort={sort}
        onSortChange={setSort}
        filter={filter}
        onFilterChange={setFilter}
        genres={genres}
        onGenresChange={setGenres}
      />

      {/* תצוגת כרטיסים */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {items.map((item, index) => (
          <MediaCard
            key={`${item.id}_${index}`}
            id={item.id}
            title={getTitle ? getTitle(item) : item.title || item.name}
            poster={item.poster_path}
            type={type}
          />
        ))}
      </div>

      {/* הודעה על חוסר תוצאות */}
      {items.length === 0 && !hasMore && (
        <div className="text-center text-gray-500 mt-6 flex flex-col items-center gap-3">
          <p>לא נמצאו תוצאות תואמות.</p>
          <button
            className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-gray-900 rounded-full transition"
            onClick={() => { setFilter({}); setGenres([]); }}
          >
            אפס סינון
          </button>
        </div>
      )}

      {hasMore && <div ref={loader} className="h-10" />}
    </div>
  );
}
