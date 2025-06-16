import axiosInstance from "./axiosInstance";

/**
 * שליפת רשימות אנשים (person)
 */
export async function fetchPersonList({
  endpoint = "popular",
  params = {},
}: {
  endpoint?: string,
  params?: any,
}) {
  let url = "";
  if (endpoint === "popular") {
    url = "/person/popular";
  } else if (endpoint === "search") {
    url = "/search/person";
  } else {
    url = endpoint;
  }
  const res = await axiosInstance.get(url, { params });
  return res.data.results;
}
