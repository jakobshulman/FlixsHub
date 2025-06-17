// Utility to get country name by code (ISO 3166-1 alpha-2)
// Source: https://www.iban.com/country-codes (static map)

const countryNames: Record<string, string> = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  // ... (truncated for brevity, will add all countries)
  US: "United States",
  IL: "Israel",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  // ... (add more as needed)
};

export function getCountryNameByCode(code: string | null | undefined): string | null {
  if (!code) return null;
  return countryNames[code.toUpperCase()] || null;
}
