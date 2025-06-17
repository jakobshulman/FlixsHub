import axiosInstance from "./axiosInstance";

export interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export async function fetchLanguages(): Promise<Language[]> {
  const res = await axiosInstance.get("/configuration/languages");
  return res.data;
}
