import GenericInfiniteGrid from "../components/GenericInfiniteGrid";

export default function TVs() {
  return (
    <GenericInfiniteGrid
      title="All TV Shows"
      type="tv"
      getTitle={(item) => item.name}
    />
  );
}
