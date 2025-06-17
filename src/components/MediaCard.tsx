import React from "react";
import { Link } from "react-router-dom";
import { useGenres } from "../context/GenresContext";

export default function MediaCard({ id, title, poster, type, genre_ids }: { id: number, title: string, poster: string | null, type: "movie" | "tv", genre_ids?: number[] }) {
  const { genres } = useGenres();
  let genreNames: string[] = [];
  if (genre_ids && genre_ids.length > 0 && genres.length > 0) {
    genreNames = genre_ids
      .map(id => genres.find(g => g.id === id)?.name)
      .filter(Boolean) as string[];
  }
  const [imgError, setImgError] = React.useState(false);
  return (
    <Link to={`/${type}/${id}`} className="w-[180px] aspect-[2/3] flex-shrink-0">
      {poster && !imgError ? (
        <img
          src={`https://image.tmdb.org/t/p/w300${poster}`}
          alt={title}
          className="rounded-xl shadow hover:shadow-lg transition w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="glyphicons_v2 picture grey poster no_image_holder w-full h-full rounded-xl flex items-center justify-center text-gray-400 text-4xl bg-gray-200"
          aria-label="אין תמונה זמינה">
          <span className="sr-only">אין תמונה זמינה</span>
        </div>
      )}
      <p className="mt-2 text-sm text-center h-[2.5rem] overflow-hidden text-ellipsis whitespace-normal leading-tight break-words">
        {title}
      </p>
      {genreNames.length > 0 && (
        <p className="text-xs text-center text-gray-500 mt-1">{genreNames.join(", ")}</p>
      )}
    </Link>
  );
}
