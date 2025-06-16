import React, { createContext, useContext, useState } from "react";
import { getUserLocation } from "../utils/locationUtils";

function getDefaultLanguage(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language');
    if (saved) return saved;
    if (navigator.language) return navigator.language;
  }
  return 'en-US';
}

function savePreferredLanguage(lang: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple country-to-language mapping
const countryToLanguage: Record<string, string> = {
  IL: "he-IL",
  FR: "fr-FR",
  US: "en-US",
  GB: "en-GB",
  DE: "de-DE",
  ES: "es-ES",
  RU: "ru-RU",
  CN: "zh-CN",
  JP: "ja-JP",
  // Add more as needed
};

async function detectAndSetLanguage(setLanguage: (lang: string) => void) {
  try {
    const position = await getUserLocation();
    const { latitude, longitude } = position.coords;
    // Use a free reverse geocoding API to get country code
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await res.json();
    const countryCode = data.address?.country_code?.toUpperCase();
    if (countryCode && countryToLanguage[countryCode]) {
      setLanguage(countryToLanguage[countryCode]);
    } else {
      setLanguage("en-US");
    }
  } catch (e) {
    setLanguage("en-US");
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => getDefaultLanguage());

  const setLanguage = (lang: string) => {
    savePreferredLanguage(lang);
    setLanguageState(lang);
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (!saved) {
        detectAndSetLanguage(setLanguage);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};