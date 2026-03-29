import axios from "axios";

const resourceBaseUrl = import.meta.env.VITE_RESOURCE_API_URL || 'http://localhost:5022';

const api = axios.create({
  baseURL: resourceBaseUrl,
});

const createAuthorizedConfig = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// Interceptor to inject token on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// TAGS (via CMS)
export const getTags = () => api.get("/cms/tags");

// IMAGES (via CMS)
export const getImages = () => api.get("/cms/images");

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/cms/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const addTagToImage = (imageId, tagName) =>
  api.post(`/cms/images/${imageId}/tags`, JSON.stringify(tagName), {
    headers: { "Content-Type": "application/json" }
  });

export const removeTagFromImage = (imageId, tagName) =>
  api.delete(`/cms/images/${imageId}/tags/${tagName}`);

// PACKS (via main controller + admin crud)
export const getPacksAdmin = () => api.get("/packs", { params: { admin: true } });
export const upsertPack = (pack) => api.post("/packs", pack);
export const deletePack = (id) => api.delete(`/packs/${id}`);

// PUZZLES (via main controller + admin crud)
export const getPuzzlesAdmin = (packId) => api.get("/puzzles", { params: { packId } });
export const upsertPuzzle = (puzzle) => api.post("/puzzles", puzzle);
export const deletePuzzle = (id) => api.delete(`/puzzles/${id}`);