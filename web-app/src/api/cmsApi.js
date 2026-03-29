import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5001/cms", // adjust port if needed
});

// TAGS
export const getTags = () => api.get("/tags");
export const createTag = (name) => api.post("/tags", { name });
export const deleteTag = (id) => api.delete(`/tags/${id}`);

// IMAGES
export const getImages = () => api.get("/images");

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const addTagToImage = (imageId, tagId) =>
  api.post(`/images/${imageId}/tags`, tagId);

export const removeTagFromImage = (imageId, tagId) =>
  api.delete(`/images/${imageId}/tags/${tagId}`);