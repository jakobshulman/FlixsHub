import React, { useRef, useEffect, useState } from "react";
import CastMemberCard from "./CastMemberCard";

interface HorizontalCastScrollerProps {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
  onScrollEnd?: () => void;
}

const arrowSVG = (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HorizontalCastScroller: React.FC<HorizontalCastScrollerProps> = ({ cast, onScrollEnd }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const checkScroll = () => {
      const scrollEnd = scroller.scrollLeft + scroller.clientWidth;
      setShowLeft(scroller.scrollLeft > 0);
      setShowRight(scrollEnd < scroller.scrollWidth - 1);
      if (onScrollEnd && scrollEnd >= scroller.scrollWidth - 10) {
        onScrollEnd();
      }
    };
    scroller.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => scroller.removeEventListener("scroll", checkScroll);
  }, [onScrollEnd, cast.length]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const visibleWidth = el.clientWidth;
    const currentScroll = el.scrollLeft;
    el.scrollTo({
      left: direction === "left" ? currentScroll - visibleWidth : currentScroll + visibleWidth,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering && showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-[-25px] top-1/2 -translate-y-1/2 bg-black/50 rounded-full w-12 h-12 z-20 flex items-center justify-center"
          aria-label="Scroll Left"
        >
          <div className="-rotate-180">{arrowSVG}</div>
        </button>
      )}
      {isHovering && showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-[-25px] top-1/2 -translate-y-1/2 bg-black/50 rounded-full w-12 h-12 z-20 flex items-center justify-center"
          aria-label="Scroll Right"
        >
          {arrowSVG}
        </button>
      )}
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide scroll-smooth"
        style={{ scrollBehavior: "smooth" }}
      >
        {cast.map((actor) => (
          <CastMemberCard key={actor.id} actor={actor} />
        ))}
      </div>
    </div>
  );
};

export default HorizontalCastScroller;
