import axiosInstance from "./axiosInstance";

type FetchMediaListParams = {
  type: "movie" | "tv";              // סוג מדיה
  language: string;                  // שפה
  page?: number;                     // עמוד
  genreId?: number | null;          // ז'אנר
  countryCode?: string | null;      // מדינת מקור
  minRating?: number;               // דירוג מינימלי
  sortBy?: string;                  // קריטריון מיון
  year?: number;                    // שנה
};

export async function fetchMediaList({
  type,
  language,
  page,
  genreId,
  countryCode,
  minRating,
  sortBy,
  year,
}: FetchMediaListParams): Promise<any[]> {
  const isDiscover = !!page;
  const url = isDiscover ? `/discover/${type}` : `/${type}/popular`;

  const params: Record<string, any> = { language };

  if (page) params.page = page;
  if (genreId) params.with_genres = genreId;
  if (countryCode) params.with_origin_country = countryCode;
  if (minRating) params["vote_average.gte"] = minRating;
  if (sortBy) params.sort_by = sortBy;
  if (year) {
    params[type === "movie" ? "primary_release_year" : "first_air_date_year"] = year;
  }

  try {
    const { data } = await axiosInstance.get(url, { params });
    return Array.isArray(data.results) ? data.results : [];
  } catch (error) {
    console.error("Error fetching media list:", error);
    return [];
  }
}
