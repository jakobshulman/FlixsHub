import axiosInstance from "./axiosInstance";

type FetchMediaListParams = {
  type: "movie" | "tv";              // סוג מדיה
  language: string;                  // שפת התוצאות (UI)
  originalLanguage?: string;         // שפת הסרט/סדרה
  page?: number;                     // עמוד
  genreIds?: number[];              // שינוי: מערך ז'אנרים
  countryCode?: string | null;      // מדינת מקור
  minRating?: number;               // דירוג מינימלי
  maxRating?: number;               // דירוג מקסימלי
  minYear?: number;                 // שנה מינימלית
  maxYear?: number;                 // שנה מקסימלית
  sortBy?: string;                  // קריטריון מיון
};

export async function fetchMediaList({
  type,
  language,
  originalLanguage,                 // חדש
  page,
  genreIds,                          // שינוי
  countryCode,
  minRating,
  maxRating,
  minYear,
  maxYear,
  sortBy,
}: FetchMediaListParams): Promise<{ results: any[]; total_pages: number; page: number }> {
  const isDiscover = !!page;
  const url = isDiscover ? `/discover/${type}` : `/${type}/popular`;

  const params: Record<string, any> = { language };

  if (page) params.page = page;
  if (genreIds && genreIds.length > 0) params.with_genres = genreIds.join(","); // שינוי
  if (countryCode) params.with_origin_country = countryCode;
  if (minRating !== undefined) params["vote_average.gte"] = minRating;
  if (maxRating !== undefined) params["vote_average.lte"] = maxRating;
  if (sortBy) params.sort_by = sortBy;
  if (minYear) params[type === "movie" ? "primary_release_date.gte" : "first_air_date.gte"] = `${minYear}-01-01`;
  if (maxYear) params[type === "movie" ? "primary_release_date.lte" : "first_air_date.lte"] = `${maxYear}-12-31`;
  if (originalLanguage) params.with_original_language = originalLanguage; // סינון לפי שפת מקור

  try {
    const { data } = await axiosInstance.get(url, { params });
    return {
      results: Array.isArray(data.results) ? data.results : [],
      total_pages: data.total_pages,
      page: data.page
    };
  } catch (error) {
    console.error("Error fetching media list:", error);
    return { results: [], total_pages: 0, page: 0 };
  }
}
