import axiosInstance from "./axiosInstance";

export async function fetchSeasonEpisodes(tvId: number, seasonNumber: number, language = "en-US") {
  const res = await axiosInstance.get(`/tv/${tvId}/season/${seasonNumber}?language=${language}`);
  return res.data;
}
