import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import MediaCard from '../components/MediaCard';
import { useLanguage } from '../context/LanguageContext';
import { useCountry } from '../context/CountryContext';
import { Link } from 'react-router-dom';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { language } = useLanguage();
  const { countryCode } = useCountry();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    axiosInstance
      .get('/search/multi', {
        params: { language, query },
      })
      .then(({ data }) => {
        setResults(Array.isArray(data.results) ? data.results : []);
        setLoading(false);
      });
  }, [query, language, countryCode]);

  // Group results by category
  const movies = results.filter((item) => item.media_type === 'movie');
  const tvShows = results.filter((item) => item.media_type === 'tv');
  const people = results.filter((item) => item.media_type === 'person');

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Results for: {query}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <div className="space-y-10">
          {movies.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3 border-b pb-1">Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((item) => (
                  <MediaCard
                    key={item.id + '-movie'}
                    id={item.id}
                    title={item.title}
                    poster={item.poster_path}
                    type="movie"
                    genre_ids={item.genre_ids}
                  />
                ))}
              </div>
            </section>
          )}
          {tvShows.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3 border-b pb-1">TV Shows</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {tvShows.map((item) => (
                  <MediaCard
                    key={item.id + '-tv'}
                    id={item.id}
                    title={item.name}
                    poster={item.poster_path}
                    type="tv"
                    genre_ids={item.genre_ids}
                  />
                ))}
              </div>
            </section>
          )}
          {people.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3 border-b pb-1">People</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {people.map((item) => (
                  <Link
                    key={item.id + '-person'}
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
                        <span role="img" aria-label="person">
                          👤
                        </span>
                      </div>
                    )}
                    <p className="text-center text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500 text-center mt-1">Person</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
