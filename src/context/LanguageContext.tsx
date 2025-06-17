import React, { createContext, useContext, useState } from "react";
import { fetchLanguages, Language as LanguageType } from "../api/fetchLanguages";
import { useCountry } from "./CountryContext";

// מיפוי קוד מדינה לשפת ברירת מחדל
const countryToLanguage: Record<string, string> = {
  IL: "he",
  US: "en-US",
  GB: "en-GB",
  FR: "fr",
  RU: "ru",
  // ...השלם לפי הצורך
};

function savePreferredLanguage(lang: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  languages: LanguageType[];
  isLanguageInitialized: boolean;
  wasLanguageAutoDetected: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function processLanguages(langs: LanguageType[]): LanguageType[] {
  return langs
    .map(lang => ({
      ...lang,
      name: lang.name === lang.english_name ? lang.english_name : lang.name
    }))
    .sort((a, b) => a.english_name.localeCompare(b.english_name));
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>("");
  const [languages, setLanguages] = useState<LanguageType[]>([]);
  const [isLanguageInitialized, setIsLanguageInitialized] = useState(false);
  const [wasLanguageAutoDetected, setWasLanguageAutoDetected] = useState(false);
  const { countryCode } = useCountry();
  const initializedRef = React.useRef(false);

  const setLanguage = (lang: string) => {
    savePreferredLanguage(lang);
    setLanguageState(lang);
    setIsLanguageInitialized(true);
    // לא לעדכן wasLanguageAutoDetected כאן, רק באתחול אוטומטי
    console.log("[LanguageContext] setLanguage called:", lang);
  };

  // קבע שפה דיפולטיבית רק פעם אחת, אחרי שיש countryCode
  React.useEffect(() => {
    if (initializedRef.current) return;
    if (!countryCode) return;
    let lang = "en-US";
    let autoDetected = false;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved) lang = saved;
      else if (countryCode && countryToLanguage[countryCode]) {
        lang = countryToLanguage[countryCode];
        autoDetected = true;
      }
    }
    setLanguage(lang); // תמיד שומר ב-localStorage
    setIsLanguageInitialized(true);
    setWasLanguageAutoDetected(autoDetected);
    initializedRef.current = true;
    console.log("[LanguageContext] Detected language:", lang, "for country:", countryCode, "autoDetected:", autoDetected);
  }, [countryCode]);

  // טען שפות רק אחרי שהשפה מאותחלת ואינה ריקה
  React.useEffect(() => {
    if (!isLanguageInitialized || !language) return;
    fetchLanguages().then((langs) => setLanguages(processLanguages(langs)));
  }, [isLanguageInitialized, language]);

  React.useEffect(() => {
    if (language) {
      console.log("[LanguageContext] language in useEffect:", language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages, isLanguageInitialized, wasLanguageAutoDetected }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}