// src/config/siteConfig.ts

export const siteConfig = {
  defaultBrand: "Flikz",
  supportedBrands: ["Flikz", "FlixMe", "StreamZone", "Binge"],
  defaultLanguage: "en-US",

  // הגדרת כותרות עמודים לפי נתיב
  routeTitles: {
    "/movies": "Movies",
    "/movies-by-region": "Movies In {country}",
    "/tvs": "TV Shows",
    "/tvs-by-region": "TV Shows In {country}",
    // "/genres": "Popular Genres"
  }
} as const;
