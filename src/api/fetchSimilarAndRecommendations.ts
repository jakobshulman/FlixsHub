import axiosInstance from "./axiosInstance";

interface FetchSimilarOrRecommendationsParams {
  mediaType: "movie" | "tv";
  mediaId: number;
  language?: string;
  page?: number;
}

export async function fetchSimilar({ mediaType, mediaId, language = "he-IL", page = 1 }: FetchSimilarOrRecommendationsParams) {
  try {
    const res = await axiosInstance.get(`/${mediaType}/${mediaId}/similar`, {
      params: { language, page },
    });
    return res.data.results;
  } catch (error) {
    console.error("Failed to fetch similar:", error);
    return [];
  }
}

export async function fetchRecommendations({ mediaType, mediaId, language = "he-IL", page = 1 }: FetchSimilarOrRecommendationsParams) {
  try {
    const res = await axiosInstance.get(`/${mediaType}/${mediaId}/recommendations`, {
      params: { language, page },
    });
    return res.data.results;
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return [];
  }
}
