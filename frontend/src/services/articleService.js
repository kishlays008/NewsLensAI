import api from "./api";

export const getArticles = async ({ category, search, page = 1, limit = 20 } = {}) => {
  const { data } = await api.get("/articles", {
    params: { category, search, page, limit },
  });
  return data;
};

export const getArticleById = async (id) => {
  const { data } = await api.get(`/articles/${id}`);
  return data;
};

export const getBookmarks = async () => {
  const { data } = await api.get("/bookmarks");
  return data;
};

export const addBookmark = async (articleId) => {
  const { data } = await api.post(`/bookmarks/${articleId}`);
  return data;
};

export const removeBookmark = async (articleId) => {
  const { data } = await api.delete(`/bookmarks/${articleId}`);
  return data;
};
