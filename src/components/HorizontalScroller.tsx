import { useEffect, useRef, useState } from "react";
import MediaCard from "./MediaCard";
import GenreCard from "./GenreCard";

export type HorizontalScrollerProps = {
  title: string;
  fetchItems: () => Promise<any[]>;
  type: "movie" | "tv" | "genre" | "mixed";
};

export default function HorizontalScroller({ title, fetchItems, type, onTitleClick }: HorizontalScrollerProps & { onTitleClick?: () => void }) {
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

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const scrollEnd = el.scrollLeft + el.clientWidth;
      setShowLeft(el.scrollLeft > 0);
      setShowRight(scrollEnd < el.scrollWidth - 1); // תיקון תנאי לסגירה מדויקת
    }
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const visibleWidth = el.clientWidth;
    const currentScroll = el.scrollLeft;
    const totalWidth = el.scrollWidth;

    const remaining = direction === "right"
      ? totalWidth - (currentScroll + visibleWidth)
      : currentScroll;

    if (remaining <= 0) return;

    const scrollAmount = remaining >= visibleWidth ? visibleWidth : remaining;
    const nextScroll = direction === "right" ? currentScroll + scrollAmount : currentScroll - scrollAmount;

    el.scrollTo({ left: nextScroll, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [items]);

  const arrowSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 31" className="w-8 h-12 fill-white">
      <path d="M5.275 29.46a1.61 1.61 0 0 0 1.456 1.077c1.018 0 1.772-.737 1.772-1.737 0-.526-.277-1.186-.449-1.62l-4.68-11.912L8.05 3.363c.172-.442.45-1.116.45-1.625A1.7 1.7 0 0 0 6.728.002a1.6 1.6 0 0 0-1.456 1.09L.675 12.774c-.301.775-.677 1.744-.677 2.495 0 .754.376 1.705.677 2.498L5.272 29.46Z"></path>
    </svg>
  );

  return (
    <div className="mb-6 relative">
      <h2 className="text-xl font-bold mb-2 px-4">
        {onTitleClick ? (
          <span className="cursor-pointer text-blue-600 hover:underline" onClick={onTitleClick}>{title}</span>
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
            className="absolute left-[-25px] top-1/2 -translate-y-1/2 bg-black/50 rounded-full w-12 h-12 z-20 flex items-center justify-center"
            aria-label="Scroll Left"
          >
            {arrowSVG}
          </button>
        )}
        {isHovering && showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-[-25px] top-1/2 -translate-y-1/2 bg-black/50 rounded-full w-12 h-12 z-20 flex items-center justify-center"
            aria-label="Scroll Right"
          >
            <div className="rotate-180">{arrowSVG}</div>
          </button>
        )}
        <div
          className="overflow-x-auto whitespace-nowrap px-4 flex gap-4 scroll-smooth scrollbar-hide"
          ref={scrollRef}
          onScroll={checkScroll}
        >
          {items.length === 0
            ? Array.from({ length: 10 }).map((_, idx) => (
                <div className="flex-shrink-0 opacity-30 w-[180px] aspect-[2/3]" key={"placeholder-" + idx}>
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
                  <div className="flex-shrink-0 w-[180px] aspect-[2/3]" key={item.id}>
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