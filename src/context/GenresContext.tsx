import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchAllGenres } from "../api/tmdbApi";
import { useLanguage } from "./LanguageContext";

const GenresContext = createContext<{ genres: any[] }>({ genres: [] });

export function GenresProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [genres, setGenres] = useState<any[]>([]);

  useEffect(() => {
    fetchAllGenres(language).then(setGenres);
  }, [language]);

  return (
    <GenresContext.Provider value={{ genres }}>
      {children}
    </GenresContext.Provider>
  );
}

export function useGenres() {
  return useContext(GenresContext);
}
