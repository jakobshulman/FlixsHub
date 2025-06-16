// src/utils/locationUtils.ts

export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}

// מחזירה קוד מדינה (2 אותיות) לפי מיקום המשתמש
export async function getUserCountryCode(): Promise<string | null> {
  try {
    const position = await getUserLocation();
    const { latitude, longitude } = position.coords;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await res.json();
    const countryCode = data.address?.country_code?.toUpperCase();
    return countryCode || null;
  } catch {
    return null;
  }
}

// מחזירה את שם המדינה המלא לפי מיקום המשתמש
export async function getUserCountryName(): Promise<string | null> {
  try {
    const position = await getUserLocation();
    const { latitude, longitude } = position.coords;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await res.json();
    return data.address?.country || null;
  } catch {
    return null;
  }
}
