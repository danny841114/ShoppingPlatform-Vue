import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/orders`,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export const orderApi = {
  addOrder(cartIds) {
    return apiClient.post("", { cartIds }, { withCredentials: true });
  },
};
