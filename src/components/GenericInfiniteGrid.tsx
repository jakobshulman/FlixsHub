import { useEffect, useState, useRef, useCallback } from "react";
import MediaCard from "./MediaCard";
import { useLanguage } from "../context/LanguageContext";
import { useCountry } from "../context/CountryContext";
import { useGenres } from "../context/GenresContext";
import { fetchMediaList } from "../api/fetchMediaList";

interface GenericInfiniteGridProps {
  title: string;
  type: "movie" | "tv";
  getTitle?: (item: any) => string;
  byRegion?: boolean;
}

export default function GenericInfiniteGrid({ title, type, getTitle, byRegion = false }: GenericInfiniteGridProps) {
  const { language } = useLanguage();
  const { countryCode } = useCountry();
  const { genres } = useGenres();

  const [items, setItems] = useState<any[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
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
    resetState();
  }, [selectedGenres, minRating, sortBy, year, language, byRegion, type, countryCode]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;

    const genreIds = selectedGenres.length > 0 ? selectedGenres : [null];
    const merged: any[] = [];
    const seen = loadedIdsRef.current;

    for (const genreId of genreIds) {
      const result = await fetchMediaList({
        type,
        language,
        page,
        genreId: genreId ?? undefined,
        countryCode: byRegion ? countryCode : null,
        minRating,
        sortBy,
        year,
      });

      result.forEach((item: any) => {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          merged.push(item);
        }
      });
    }

    setItems((prev) => [...prev, ...merged]);
    setHasMore(merged.length > 0);
  }, [page, selectedGenres, language, byRegion, type, countryCode, minRating, sortBy, year, hasMore]);

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
    <div className="p-4 max-w-6xl mx-auto">
      {/* כותרת ופילטרים מקובעים בראש הדף */}
      <div className="sticky top-[64px] bg-white z-30 py-4 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1)] w-full px-4 sm:px-6 lg:px-8">
        {/* כותרת */}
        {/* <h1 className="text-2xl font-bold mb-4">{title}</h1> */}

        {/* פילטרים */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() =>
                setSelectedGenres((prev) =>
                  prev.includes(genre.id)
                    ? prev.filter((id) => id !== genre.id)
                    : [...prev, genre.id]
                )
              }
              className={`px-3 py-1 rounded-full text-sm border transition ${
                selectedGenres.includes(genre.id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {genre.name}
            </button>
          ))}
          <button
            onClick={() => setSelectedGenres([])}
            className="text-sm text-red-500 underline"
          >
            אפס בחירה
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="number"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            placeholder="דירוג מינימלי (0-10)"
            min={0}
            max={10}
            step={0.1}
            className="w-32 px-3 py-1 rounded border text-sm"
          />
          <input
            type="number"
            value={year || ""}
            onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="שנה"
            className="w-24 px-3 py-1 rounded border text-sm"
          />
          <div className="flex gap-2 text-sm">
            {[
              { label: "פופולריות", value: "popularity.desc" },
              { label: "דירוג", value: "vote_average.desc" },
              { label: "שנה", value: type === "movie" ? "primary_release_date.desc" : "first_air_date.desc" }
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSortBy(value)}
                className={`px-3 py-1 rounded-full border transition ${
                  sortBy === value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* תצוגת כרטיסים */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
        <p className="text-center text-gray-500 mt-6">לא נמצאו תוצאות תואמות.</p>
      )}

      {hasMore && <div ref={loader} className="h-10" />}
    </div>
  );
}
