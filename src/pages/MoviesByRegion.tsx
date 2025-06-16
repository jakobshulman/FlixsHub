import GenericInfiniteGrid from "../components/GenericInfiniteGrid";

export default function MoviesByRegion() {
  return (
    <GenericInfiniteGrid
      title="Movies In Your Region"
      type="movie"
      getTitle={(item) => item.title}
      byRegion={true}
    />
  );
}
