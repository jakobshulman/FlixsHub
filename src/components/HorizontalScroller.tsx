import { useCallback, useEffect, useRef, useState } from "react";
import MediaCard from "./MediaCard";
import GenreCard from "./GenreCard";

export type HorizontalScrollerProps = {
  title: string;
  fetchItems: () => Promise<any[]>;
  type: "movie" | "tv" | "genre" | "mixed";
  onTitleClick?: () => void;
  onScrollEnd?: () => void;
};

const arrowSVG = (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HorizontalScroller({ title, fetchItems, type, onTitleClick, onScrollEnd }: HorizontalScrollerProps) {
  const [items, setItems] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchItems().then(data => {
      if (mounted) setItems(data);
    });
    return () => { mounted = false; };
  }, [fetchItems]);

  // הוספת useCallback ל-checkScroll כדי למנוע בעיית תלות
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const scrollEnd = el.scrollLeft + el.clientWidth;
      setShowLeft(el.scrollLeft > 0);
      setShowRight(scrollEnd < el.scrollWidth - 1);
      if (onScrollEnd && scrollEnd >= el.scrollWidth - 10) {
        onScrollEnd();
      }
    }
  }, [onScrollEnd]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const visibleWidth = el.clientWidth;
    const currentScroll = el.scrollLeft;
    el.scrollTo({
      left: direction === "left" ? currentScroll - visibleWidth : currentScroll + visibleWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    checkScroll(); // Ensure arrows are shown on mount
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [items.length, checkScroll]);

  return (
    <div className="mb-6 relative">
      <h2 className="text-xl font-bold mb-2 px-4">
        {onTitleClick ? (
          <span className="cursor-pointer hover:underline" onClick={onTitleClick}>{title}</span>
        ) : (
          title
        )}
      </h2>
      <div
        className="relative overflow-visible"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {isHovering && showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 border border-white shadow-lg rounded-full w-10 h-10 z-20 flex items-center justify-center transition-opacity duration-200 hover:bg-black/90"
            aria-label="Scroll Left"
            style={{ opacity: 0.92 }}
          >
            <div className="-rotate-180">{arrowSVG}</div>
          </button>
        )}
        {isHovering && showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 border border-white shadow-lg rounded-full w-10 h-10 z-20 flex items-center justify-center transition-opacity duration-200 hover:bg-black/90"
            aria-label="Scroll Right"
            style={{ opacity: 0.92 }}
          >
            {arrowSVG}
          </button>
        )}
        <div
          className="overflow-x-auto whitespace-nowrap pl-4 pr-0 flex gap-4 scroll-smooth scrollbar-hide box-border"
          ref={scrollRef}
          onScroll={checkScroll}
        >
          {items.length === 0
            ? Array.from({ length: 10 }).map((_, idx) => (
                <div className="flex-shrink-0 opacity-30 w-[172px] aspect-[2/3]" key={"placeholder-" + idx}>
                  {type === "genre" ? (
                    <div className="w-32 h-16 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded animate-pulse" />
                  )}
                </div>
              ))
            : items.map((item) => (
                type === "genre" ? (
                  <div className="flex-shrink-0" key={item.id}>
                    <GenreCard id={item.id} name={item.name} />
                  </div>
                ) : (
                  <div className="flex-shrink-0" key={item.id}>
                    <MediaCard
                      id={item.id}
                      title={item.title || item.name}
                      poster={item.poster_path || null}
                      type={type === "mixed" ? (item.media_type === "tv" ? "tv" : "movie") : type}
                      genre_ids={item.genre_ids}
                      vote_average={item.vote_average}
                    />
                  </div>
                )
              ))}
        </div>
      </div>
      <div className="border-b border-gray-200 w-full mt-2" />
    </div>
  );
}