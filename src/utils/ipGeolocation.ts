// Utility to get country code by IP (no user permission required)
export async function getCountryCodeByIP(): Promise<string | null> {
  try {
    // Using ipinfo.io with user-provided token
    const res = await fetch("https://ipinfo.io/json?token=04bdbf1c222c13");
    if (!res.ok) return null;
    const data = await res.json();
    return data.country || null;
  } catch {
    return null;
  }
}
