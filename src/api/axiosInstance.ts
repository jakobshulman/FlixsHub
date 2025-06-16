// src/api/axiosInstance.ts
import axios from "axios";

const API_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.REACT_APP_TMDB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export default axiosInstance;
