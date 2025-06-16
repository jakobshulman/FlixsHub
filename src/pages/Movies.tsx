import GenericInfiniteGrid from "../components/GenericInfiniteGrid";

export default function Movies() {
  return (
    <GenericInfiniteGrid
      title="All Movies"
      type="movie"
      getTitle={(item) => item.title}
    />
  );
}
