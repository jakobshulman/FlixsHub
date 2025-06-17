import React, { createContext, useContext, useEffect, useState } from "react";
import { getCountryCodeByIP } from "../utils/ipGeolocation";
import { getCountryNameByCode } from "../utils/countryNames";

interface CountryContextType {
  countryCode: string | null;
  countryName: string | null;
  setCountryCode: (code: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getCountryCodeByIP().then((code) => {
      if (mounted && code) {
        setCountryCode(code);
        setCountryName(getCountryNameByCode(code));
        console.log("[CountryContext] Detected country code:", code);
      }
    });
    return () => { mounted = false; };
  }, []);

  // עדכון שם מדינה כאשר קוד משתנה ידנית
  useEffect(() => {
    setCountryName(getCountryNameByCode(countryCode));
  }, [countryCode]);

  return (
    <CountryContext.Provider value={{ countryCode, countryName, setCountryCode }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = (): CountryContextType => {
  const context = useContext(CountryContext);
  if (!context) throw new Error("useCountry must be used within CountryProvider");
  return context;
};
