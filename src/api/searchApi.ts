// src/api/searchApi.ts
import axiosInstance from "./axiosInstance";

// חיפוש כללי (סרטים, סדרות, אנשים)
export async function searchMulti(query: string, language = "en-US") {
  const res = await axiosInstance.get(`/search/multi`, {
    params: { query, language },
  });
  return res.data.results;
}

// חיפוש סרטים בלבד
export async function searchMovies(query: string, language = "en-US") {
  const res = await axiosInstance.get(`/search/movie`, {
    params: { query, language },
  });
  return res.data.results;
}

// חיפוש סדרות בלבד
export async function searchTV(query: string, language = "en-US") {
  const res = await axiosInstance.get(`/search/tv`, {
    params: { query, language },
  });
  return res.data.results;
}

// חיפוש אנשים בלבד
export async function searchPeople(query: string, language = "en-US") {
  const res = await axiosInstance.get(`/search/person`, {
    params: { query, language },
  });
  return res.data.results;
}
