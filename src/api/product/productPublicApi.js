import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/public/products`,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export const productPublicApi = {
  getProducts(size = 12, page = 0, keyword = "") {
    return apiClient.get("", {
      params: {
        size,
        page,
        keyword,
      },
    });
  },

  getProductById(id) {
    return apiClient.get(`/${id}`, {
      withCredentials: true,
    });
  },
};
