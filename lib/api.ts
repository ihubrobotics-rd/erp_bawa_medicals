import axios from "axios";
import { getAccessToken, refreshAccessToken } from "./api/auth";

const api = axios.create({
  baseURL: "http://192.168.1.33:8005",
  // withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If access token expired, try refreshing
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
