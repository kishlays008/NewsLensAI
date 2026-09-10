import api from "./api";

export const summarizeUrl = async (url) => {
  const { data } = await api.post("/summarize", { url });
  return data;
};
