import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/vendor/products`,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export const productVendorApi = {
  getProductsByVendor() {
    return apiClient.get("", {
      withCredentials: true,
    });
  },

  addProduct(name, description, price, quantity, photo) {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);
    if (photo) {
      formData.append("photo", photo);
    }

    return apiClient.post("", formData, {
      withCredentials: true,
    });
  },

  updateProduct(id, name, description, price, quantity, photo) {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);
    if (photo instanceof File && photo.size > 0) {
      formData.append("photo", photo);
    }

    return apiClient.put(`/${id}`, formData, {
      withCredentials: true,
    });
  },

  deleteProduct(id) {
    return apiClient.delete(`/${id}`, {
      withCredentials: true,
    });
  },
};
