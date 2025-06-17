import React, { useEffect, useState, useRef, useCallback } from "react";
import MediaCard from "./MediaCard";
import { useLanguage } from "../context/LanguageContext";
import { useCountry } from "../context/CountryContext";
import { fetchMediaList } from "../api/fetchMediaList";
import FilterBar, { FilterValues } from "./FilterBar";
import { siteConfig } from "../config/siteConfig";

type MediaListResult = {
  results: any[];
  total_pages: number;
  page: number;
};

interface GenericInfiniteGridProps {
  title: string;
  type: "movie" | "tv";
  getTitle?: (item: any) => string;
  byRegion?: boolean;
  genres?: number[];
}

export default function GenericInfiniteGrid({ title, type, getTitle, byRegion = false, genres: genresProp }: GenericInfiniteGridProps) {
  const { language } = useLanguage();
  const { countryCode, countryName } = useCountry();

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
  const [genres, setGenres] = useState<number[]>(genresProp || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const loadedIdsRef = useRef<Set<number>>(new Set());
  const [columns, setColumns] = useState(5);

  const resetState = () => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    loadedIdsRef.current = new Set();
  };

  // איפוס סטייט מלא ב-change פילטרים/שפה/סורט
  useEffect(() => {
    setItems([]);
    setHasMore(true);
    loadedIdsRef.current = new Set();
    setPage(1);
  }, [sort, filter, genres, language, byRegion, type, countryCode]);

  // לוגים לדיבאג
  useEffect(() => {
    // console.log('[DEBUG] page:', page, 'isLoading:', isLoading, 'hasMore:', hasMore, 'items.length:', items.length);
  }, [page, isLoading, hasMore, items]);

  // הגדרת loadMore לפני כל useEffect שמשתמש בו
  const loadMore = useCallback(async () => {
    // console.log('[DEBUG] loadMore called, page:', page);
    if (!hasMore) {
      // console.log('[DEBUG] loadMore: hasMore is false, returning');
      return;
    }
    setIsLoading(true);
    const resultObj: MediaListResult = await fetchMediaList({
      type,
      language,
      originalLanguage: filter.language || undefined,
      page,
      genreIds: filter.selectedGenres && filter.selectedGenres.length > 0 ? filter.selectedGenres : genres,
      countryCode: byRegion ? countryCode : null,
      minRating: filter.minRating,
      maxRating: filter.maxRating,
      minYear: filter.minYear,
      maxYear: filter.maxYear,
      sortBy: filter.sortBy || sort,
    });
    const { results, total_pages } = resultObj;
    // console.log('[DEBUG] fetchMediaList result:', results);
    const seen = loadedIdsRef.current;
    const merged = results.filter((item: any) => !seen.has(item.id));
    merged.forEach((item: any) => seen.add(item.id));
    setItems((prev) => {
      const updated = [...prev, ...merged];
      // console.log('[DEBUG] setItems, new length:', updated.length);
      return updated;
    });
    setHasMore(page < total_pages);
    setIsLoading(false);
    // console.log('[DEBUG] loadMore finished, hasMore:', page < total_pages);
  }, [page, sort, filter, genres, language, byRegion, type, countryCode, hasMore]);

  // טעינה בכל שינוי page
  useEffect(() => {
    let cancelled = false;
    const fetchPage = async () => {
      setIsLoading(true);
      await loadMore();
      if (!cancelled) setIsLoading(false);
    };
    fetchPage();
    return () => { cancelled = true; };
  }, [page, loadMore]);

  useEffect(() => {
    // Calculate columns based on container width
    function updateColumns() {
      if (gridRef.current) {
        const width = gridRef.current.offsetWidth;
        const colCount = Math.max(1, Math.floor(width / 190));
        setColumns(colCount);
      }
    }
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // שמירה של הערכים האחרונים
  const lastDeps = useRef({ sort, filter, genres, language, byRegion, type, countryCode });

  useEffect(() => {
    const depsChanged =
      lastDeps.current.sort !== sort ||
      JSON.stringify(lastDeps.current.filter) !== JSON.stringify(filter) ||
      JSON.stringify(lastDeps.current.genres) !== JSON.stringify(genres) ||
      lastDeps.current.language !== language ||
      lastDeps.current.byRegion !== byRegion ||
      lastDeps.current.type !== type ||
      lastDeps.current.countryCode !== countryCode;
    if (depsChanged) {
      setItems([]);
      setHasMore(true);
      loadedIdsRef.current = new Set();
      setPage(1);
      lastDeps.current = { sort, filter, genres, language, byRegion, type, countryCode };
    }
  }, [sort, filter, genres, language, byRegion, type, countryCode]);

  // שמור observer ברפרנס
  const observerRef = useRef<IntersectionObserver | null>(null);

  // callback ref ל-loader
  const loaderCallback = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (node && hasMore) {
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prev) => prev + 1);
        }
      }, { threshold: 1 });
      observerRef.current.observe(node);
    }
  }, [hasMore, isLoading]);

  // טעינה אוטומטית של דף נוסף אחרי טעינה ראשונית עם לוגים
  useEffect(() => {
    // console.log('[DEBUG] auto-load next page effect: items.length =', items.length, 'page =', page);
    if (items.length > 0 && page === 1) {
      const timeout = setTimeout(() => {
        // console.log('[DEBUG] setPage(2) from auto-load next page effect');
        setPage(2);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [items, page]);

  // טעינה אוטומטית של עמודים נוספים אם אין מספיק תוצאות לגלילה
  useEffect(() => {
    if (!isLoading && hasMore && items.length > 0 && document.body.scrollHeight <= window.innerHeight) {
      setPage((prev) => prev + 1);
    }
  }, [items, isLoading, hasMore]);

  // Calculate placeholders to fill last row
  const placeholders = [];
  if (!isLoading && items.length > 0 && columns > 0) {
    const remainder = items.length % columns;
    if (remainder !== 0) {
      for (let i = 0; i < columns - remainder; i++) {
        placeholders.push(<div key={`ph-${i}`} className="rounded-xl bg-gray-100 h-[290px]" />);
      }
    }
  }

  // החלפת {country} בשם המדינה אם קיים
  const displayTitle = title.includes("{country}")
    ? title.replace("{country}", countryName || countryCode || "")
    : title.replace("Your Region", countryName || countryCode || "Your Region");

  return (
    <div className="w-full">
      <div className="fixed left-0 w-full z-50 bg-white shadow-md border-b" style={{ top: 55 }}>
        <FilterBar
          sort={sort}
          onSortChange={setSort}
          filter={filter}
          onFilterChange={setFilter}
          genres={genres}
          onGenresChange={setGenres}
        />
      </div>
      <div className="h-24" />
      <h1 className="text-2xl font-bold mb-4 px-4">{displayTitle}</h1>

      {/* תצוגת כרטיסים */}
      <div ref={gridRef} className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] mt-4">
        {items.map((item, idx) => (
          <div key={item.id} className="p-1">
            <MediaCard
              id={item.id}
              title={getTitle ? getTitle(item) : item.title || item.name}
              poster={item.poster_path}
              type={type}
              genre_ids={item.genre_ids}
              vote_average={item.vote_average}
            />
          </div>
        ))}
        {placeholders}
      </div>

      {/* קו דק בין תיאור לקאסט */}
      <div className="border-b border-gray-200 my-8" />

      {/* קאסט */}
      {/* כאן תוכל להוסיף קומפוננטה של קאסט אם יש צורך */}

      {/* קו דק מתחת לטופ קאסט */}
      <div className="border-b border-gray-200 my-8" />

      {/* הודעה על חוסר תוצאות */}
      {items.length === 0 && !hasMore && (
        <div className="text-center text-gray-500 mt-6 flex flex-col items-center gap-3">
          <p>לא נמצאו תוצאות תואמות.</p>
          <button
            className={`px-4 py-2 ${siteConfig.buttonColors.primaryBg} ${siteConfig.buttonColors.primaryHover} ${siteConfig.buttonColors.primaryText} rounded-full transition`}
            onClick={() => { setFilter({}); setGenres([]); }}
          >
            אפס סינון
          </button>
        </div>
      )}

      {hasMore && <div ref={loaderCallback} className="h-10" />}
    </div>
  );
}
