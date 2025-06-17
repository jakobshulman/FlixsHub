import React, { createContext, useContext, useEffect, useState } from "react";
import { getCountryCodeByIP } from "../utils/ipGeolocation";

interface CountryContextType {
  countryCode: string | null;
  setCountryCode: (code: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getCountryCodeByIP().then((code) => {
      if (mounted && code) {
        setCountryCode(code);
        console.log("[CountryContext] Detected country code:", code);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <CountryContext.Provider value={{ countryCode, setCountryCode }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = (): CountryContextType => {
  const context = useContext(CountryContext);
  if (!context) throw new Error("useCountry must be used within CountryProvider");
  return context;
};
