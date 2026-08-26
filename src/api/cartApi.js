import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/cart`,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export const cartApi = {
  getCartItems() {
    return apiClient.get("", { withCredentials: true });
  },

  updateCartItemQuantity(productId, quantity) {
    return apiClient.put(
      `/${productId}`,
      { quantity },
      { withCredentials: true },
    );
  }
};
