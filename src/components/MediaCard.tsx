import React from "react";
import { Link } from "react-router-dom";
import { useGenres } from "../context/GenresContext";

export default function MediaCard({ id, title, poster, type, genre_ids }: { id: number, title: string, poster: string | null, type: "movie" | "tv", genre_ids?: number[] }) {
  const { genres } = useGenres();
  let genreName = "";
  if (genre_ids && genre_ids.length > 0 && genres.length > 0) {
    const found = genres.find(g => g.id === genre_ids[0]);
    if (found) genreName = found.name;
  }
  return (
    <Link to={`/${type}/${id}`} className="w-[180px] aspect-[2/3] flex-shrink-0">
      {poster ? (
        <img
          src={`https://image.tmdb.org/t/p/w300${poster}`}
          alt={title}
          className="rounded-xl shadow hover:shadow-lg transition w-full h-full object-cover"
        />
      ) : (
        <div className="glyphicons_v2 picture grey poster no_image_holder w-full h-full rounded-xl flex items-center justify-center text-gray-400 text-4xl bg-gray-200">
        </div>
      )}
      <p className="mt-2 text-sm text-center h-[2.5rem] overflow-hidden text-ellipsis whitespace-normal leading-tight break-words">
        {title}
      </p>
      {genreName && (
        <p className="text-xs text-center text-gray-500 mt-1">{genreName}</p>
      )}
    </Link>
  );
}
