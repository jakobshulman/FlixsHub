import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import MediaCard from "../components/MediaCard";
import { useLanguage } from "../context/LanguageContext";
import { useCountry } from "../context/CountryContext";
import { Link } from "react-router-dom";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { language } = useLanguage();
  const { countryCode } = useCountry();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    axiosInstance
      .get("/search/multi", {
        params: { language, query },
      })
      .then(({ data }) => {
        setResults(Array.isArray(data.results) ? data.results : []);
        setLoading(false);
      });
  }, [query, language, countryCode]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Results for: {query}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((item) =>
            item.media_type === "person" ? (
              <Link
                key={item.id + "-person"}
                to={`/person/${item.id}`}
                className="w-[180px] aspect-[2/3] flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 rounded-xl shadow hover:shadow-lg transition p-4"
              >
                {item.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.profile_path}`}
                    alt={item.name}
                    className="rounded-full w-24 h-24 object-cover mb-2"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl text-gray-400 mb-2">
                    <span>👤</span>
                  </div>
                )}
                <p className="text-center text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Person
                </p>
              </Link>
            ) : (
              <MediaCard
                key={item.id + "-" + (item.media_type || "")}
                id={item.id}
                title={item.title || item.name}
                poster={item.poster_path}
                type={item.media_type === "tv" ? "tv" : "movie"}
                genre_ids={item.genre_ids}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
