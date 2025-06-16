import React, { useEffect, useState, useRef } from "react";
import { Outlet, Link, useSearchParams, useLocation } from "react-router-dom";
import { useLanguage } from "./context/LanguageContext";
import { siteConfig } from "./config/siteConfig";
import { getUserCountryName } from "./utils/locationUtils";
import axiosInstance from "./api/axiosInstance";
import UserMenu from "./components/UserMenu";

export default function Layout() {
  const { language, setLanguage } = useLanguage();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [countryName, setCountryName] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const brand = searchParams.get("brand") || null;

  const routeTitles = siteConfig.routeTitles;
  const path = location.pathname as keyof typeof routeTitles;
  const baseTitle = routeTitles[path];

  useEffect(() => {
    getUserCountryName().then(setCountryName);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get("/search/multi", { params: { query: value, language } });
        setSuggestions(Array.isArray(data.results) ? data.results.slice(0, 6) : []);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const routeTitle = (baseTitle?.includes("{country}") && countryName)
    ? baseTitle.replace("{country}", countryName)
    : baseTitle;

  // סימולציה של משתמש רשום בלוקלהוסט בלבד
  const [user, setUser] = useState<{ name: string } | null>(() => {
    if (window.location.hostname === "localhost") {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="font-sans">
      <header className="sticky top-0 z-40 bg-white shadow flex items-center justify-between px-4 py-2">
        <Link to="/" className="text-xl font-bold tracking-tight">MovieApp</Link>
        {(brand || routeTitle) && (
          <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
            {routeTitle || brand}
          </div>
        )}
        <div className="flex items-center gap-4">
          <form onSubmit={e => { e.preventDefault(); const q = searchValue.trim(); if(q) window.location.href = `/search?q=${encodeURIComponent(q)}`; }} className="mr-4 relative">
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
              <ul className="absolute left-0 right-0 bg-white border rounded shadow z-50 mt-1 text-black max-h-60 overflow-y-auto">
                {suggestions.map((item) => (
                  <li key={item.id + '-' + (item.media_type || '')}>
                    {item.media_type === "person" ? (
                      <a
                        href={`/person/${item.id}`}
                        className="block px-3 py-2 hover:bg-gray-100 truncate flex items-center"
                        onClick={() => setSuggestions([])}
                      >
                        {item.profile_path && (
                          <img src={`https://image.tmdb.org/t/p/w45${item.profile_path}`} alt={item.name} className="w-6 h-6 rounded-full mr-2" />
                        )}
                        {item.name}
                      </a>
                    ) : (
                      <a
                        href={`/${item.media_type === "tv" ? "tv" : "movie"}/${item.id}`}
                        className="block px-3 py-2 hover:bg-gray-100 truncate flex items-center"
                        onClick={() => setSuggestions([])}
                      >
                        {item.poster_path && (
                          <img src={`https://image.tmdb.org/t/p/w45${item.poster_path}`} alt={item.title || item.name} className="w-6 h-9 rounded mr-2 object-cover" />
                        )}
                        {item.title || item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </form>
          <nav className="space-x-4">
            <Link to="/movies" className="hover:underline">Movies</Link>
            <Link to="/tv" className="hover:underline">TV Shows</Link>
          </nav>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-black p-1 rounded"
          >
            <option value="en-US">English</option>
            <option value="he-IL">עברית</option>
            <option value="fr-FR">Français</option>
          </select>
          <UserMenu user={user} onLogout={handleLogout} />
        </div>
      </header>
      <main className="max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
