import React from "react";
import { useParams } from "react-router-dom";
import GenericInfiniteGrid from "../components/GenericInfiniteGrid";

export default function Genre() {
  const { id } = useParams<{ id: string }>();
  const genreId = Number(id);
  if (!genreId) return <div className="p-8">Invalid genre</div>;
  return (
    <GenericInfiniteGrid
      title={""}
      type="movie"
      getTitle={item => item.title || item.name}
      byRegion={false}
      genres={[genreId]}
    />
  );
}
