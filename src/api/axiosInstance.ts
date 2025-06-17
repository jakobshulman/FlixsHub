// src/api/axiosInstance.ts
import axios from "axios";

const API_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.REACT_APP_TMDB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: TOKEN ? `Bearer ${TOKEN}` : undefined,
  },
});

if (!TOKEN) {
  // eslint-disable-next-line no-console
  console.error("REACT_APP_TMDB_TOKEN is missing. API requests will fail.");
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // ניתן להרחיב כאן טיפול בשגיאות
    if (error.response) {
      // eslint-disable-next-line no-console
      console.error("API Error:", error.response.status, error.response.data);
    } else {
      // eslint-disable-next-line no-console
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
