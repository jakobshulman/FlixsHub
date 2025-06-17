import axiosInstance from "./axiosInstance";

export async function fetchPersonImages(id: number) {
  const res = await axiosInstance.get(`/person/${id}/images`);
  return res.data.profiles || [];
}

export async function fetchPersonExternalIds(id: number) {
  const res = await axiosInstance.get(`/person/${id}/external_ids`);
  return res.data;
}
