import React from "react";
import { Link } from "react-router-dom";
import { useGenres } from "../context/GenresContext";

export default function MediaCard({ id, title, poster, type, genre_ids, vote_average }: { id: number, title: string, poster: string | null, type: "movie" | "tv", genre_ids?: number[], vote_average?: number }) {
  const { genres } = useGenres();
  let genreNames: string[] = [];
  if (genre_ids && genre_ids.length > 0 && genres.length > 0) {
    genreNames = genre_ids
      .map(id => genres.find(g => g.id === id)?.name)
      .filter(Boolean) as string[];
  }
  const [imgError, setImgError] = React.useState(false);
  return (
    <Link to={`/${type}/${id}`} className="w-[172px] aspect-[2/3] flex-shrink-0 flex flex-col box-border">
      <div className="w-full aspect-[2/3] relative rounded-xl overflow-hidden">
        {poster && !imgError ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${poster}`}
            alt={title}
            className="w-full h-full object-cover rounded-xl"
            loading="lazy"
            onError={() => setImgError(true)}
            style={{ aspectRatio: '2/3' }}
          />
        ) : (
          <div className="glyphicons_v2 picture grey poster no_image_holder w-full h-full rounded-xl flex items-center justify-center text-gray-400 text-4xl bg-gray-200"
            aria-label="No image available">
            <span className="sr-only">No image available</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-center h-[2.5rem] overflow-hidden text-ellipsis whitespace-normal leading-tight break-words">
        {title}
      </p>
      {(genreNames.length > 0 || vote_average !== undefined) && (
        <div className="flex flex-col items-center mt-1">
          {genreNames.length > 0 && (
            <span className="text-xs text-gray-500">{genreNames.join(", ")}</span>
          )}
          {vote_average !== undefined && (
            <span className="text-xs text-gray-500">Rating: {vote_average.toFixed(1)}</span>
          )}
        </div>
      )}
    </Link>
  );
}
