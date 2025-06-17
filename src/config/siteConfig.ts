// src/config/siteConfig.ts

export const siteConfig = {
  defaultBrand: "Flikz",
  supportedBrands: ["Flikz", "FlixMe", "StreamZone", "Binge"],
  defaultLanguage: "en-US",

  Appname: "FliksHub",
  // הגדרת כותרות עמודים לפי נתיב
  routeTitles: {
    "/movies": "Movies",
    "/movies-by-region": "Movies In {country}",
    "/tvs": "TV Shows",
    "/tvs-by-region": "TV Shows In {country}",
    // "/genres": "Popular Genres"
  },

  buttonColors: {
    primaryBg: "bg-yellow-300",
    primaryHover: "hover:bg-yellow-400",
    primaryText: "text-gray-900",
    primaryBorder: "border-yellow-400",
    secondaryBg: "bg-gray-100",
    secondaryHover: "hover:bg-gray-200",
    secondaryText: "text-gray-900",
    secondaryBorder: "border-gray-300",
    // ניתן להוסיף עוד סטים (למשל danger, success וכו')
  },

  divider: {
    border: "border-gray-300",
    borderStrong: "border-yellow-400", // לדוג' קו מודגש
    thickness: "border-t-2",
    // אפשר להוסיף עוד לפי צורך
  },
} as const;
