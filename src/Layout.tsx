import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Outlet, Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext';
import { useCountry } from './context/CountryContext';
import { siteConfig } from './config/siteConfig';
import axiosInstance from './api/axiosInstance';
import LanguageDetectedModal from './components/LanguageDetectedModal';

export default function Layout() {
  const { language, setLanguage, languages, isLanguageInitialized, wasLanguageAutoDetected } =
    useLanguage();
  const { countryName, countryCode } = useCountry();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const brand = searchParams.get('brand') || null;

  const routeTitles = siteConfig.routeTitles;
  const path = location.pathname as keyof typeof routeTitles;
  const baseTitle = routeTitles[path];

  // ודא שהשפה מוצגת רק כאשר רשימת השפות נטענה
  const isLanguagesLoaded = languages.length > 0;

  useEffect(() => {
    // אם השפה שבלוקל סטורג' לא קיימת ברשימת השפות, נבחר את הראשונה ברשימה
    if (
      isLanguagesLoaded &&
      isLanguageInitialized &&
      language &&
      !languages.find((l) => l.iso_639_1 === language)
    ) {
      setLanguage(languages[0].iso_639_1);
    }
  }, [isLanguagesLoaded, languages, language, setLanguage, isLanguageInitialized]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }
      searchTimeout.current = setTimeout(async () => {
        try {
          const { data } = await axiosInstance.get('/search/multi', {
            params: { query: value, language },
          });
          setSuggestions(Array.isArray(data.results) ? data.results.slice(0, 6) : []);
        } catch {
          setSuggestions([]);
        }
      }, 300);
    },
    [language],
  );

  const [showLangModal, setShowLangModal] = useState(false);
  const [langModalWasShown, setLangModalWasShown] = useState(false);

  useEffect(() => {
    // הצג מודאל רק אם השפה זוהתה אוטומטית (לא מה-localStorage) ובכניסה ראשונה בלבד
    if (
      isLanguageInitialized &&
      languages.length > 0 &&
      !langModalWasShown &&
      wasLanguageAutoDetected
    ) {
      setShowLangModal(true);
      setLangModalWasShown(true);
    }
    // איפוס הדגל בטעינה מחדש
    if (!wasLanguageAutoDetected && langModalWasShown) {
      setLangModalWasShown(false);
    }
  }, [isLanguageInitialized, languages, langModalWasShown, wasLanguageAutoDetected]);

  // אם יש צורך בשם המדינה, יש להוסיף מימוש מתאים בהמשך.
  const routeTitle = baseTitle
    ? baseTitle.includes('{country}')
      ? baseTitle.replace('{country}', countryName || countryCode || '')
      : baseTitle
    : undefined;

  return (
    <div className="font-sans min-h-screen">
      {showLangModal && (
        <LanguageDetectedModal
          language={language}
          languages={languages}
          onChange={setLanguage}
          onClose={() => setShowLangModal(false)}
        />
      )}
      <header className="sticky top-0 z-40 bg-black shadow flex items-center justify-between px-4 py-2">
        <Link to="/" className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
          {siteConfig.Appname}
        </Link>
        {(brand || routeTitle) && (
          <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-white">
            {routeTitle || brand}
          </div>
        )}
        <div className="flex items-center gap-4">
          {/* שים לב: ייתכן שהשורה <a href לא שלמה/שגויה, לכן לא נוגעים בה */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = searchValue.trim();
              if (q) {
                navigate(`/search?q=${encodeURIComponent(q)}`);
                setSuggestions([]); // Close dropdown on search submit
              }
            }}
            className="mr-4 relative"
          >
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className="p-1 rounded border text-black w-36"
              autoComplete="off"
              value={searchValue}
              onChange={handleSearchChange}
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-black border border-gray-700 rounded shadow z-50 mt-1 text-white max-h-60 overflow-y-auto">
                {suggestions.map((item) => (
                  <li key={item.id + '-' + (item.media_type || '')}>
                    {item.media_type === 'person' ? (
                      <Link
                        to={`/person/${item.id}`}
                        className="block px-3 py-2 hover:bg-gray-800 truncate flex items-center text-white"
                        onClick={() => setSuggestions([])}
                      >
                        {item.profile_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w45${item.profile_path}`}
                            alt={item.name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                        )}
                        {item.name}
                      </Link>
                    ) : (
                      <Link
                        to={`/${item.media_type === 'tv' ? 'tv' : 'movie'}/${item.id}`}
                        className="block px-3 py-2 hover:bg-gray-800 truncate flex items-center text-white"
                        onClick={() => setSuggestions([])}
                      >
                        {item.poster_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w45${item.poster_path}`}
                            alt={item.title || item.name}
                            className="w-6 h-9 rounded mr-2 object-cover"
                          />
                        )}
                        {item.title || item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </form>
          <nav className="space-x-4">
            <Link to="/movies" className="hover:underline text-white">
              Movies
            </Link>
            <Link to="/tvs" className="hover:underline text-white">
              TV Shows
            </Link>
          </nav>
          {isLanguagesLoaded && (
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-black p-0.5 rounded text-xs w-auto min-w-0"
              style={{ minWidth: 0, width: 'auto', maxWidth: 80 }}
            >
              {languages.map((lang) => (
                <option key={lang.iso_639_1} value={lang.iso_639_1}>
                  {lang.english_name}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>
      {/* <main className="max-w-6xl mx-auto"> */}
      <main className="w-full px-1 md:px-2">
        <Outlet />
      </main>
    </div>
  );
}
