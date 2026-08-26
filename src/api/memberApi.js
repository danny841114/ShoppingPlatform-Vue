import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export const memberApi = {
  register(account, password) {
    return apiClient.post(`/register`, { account, password });
  },

  login(account, password) {
    return apiClient.post(
      `/login`,
      { account, password },
      { withCredentials: true },
    );
  },
};
