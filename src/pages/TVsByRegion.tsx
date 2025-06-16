import GenericInfiniteGrid from "../components/GenericInfiniteGrid";

export default function TVsByRegion() {
  return (
    <GenericInfiniteGrid
      title="TV Shows In Your Region"
      type="tv"
      getTitle={(item) => item.name}
      byRegion={true}
    />
  );
}
