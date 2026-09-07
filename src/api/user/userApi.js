import axios from "axios";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/users`,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export const userApi = {
  fetchMe() {
    return apiClient.get("/me", { withCredentials: true });
  },

  addVendor() {
    return apiClient.post("/me/vendor-profile", null, {
      withCredentials: true,
    });
  },

  setRole(role) {
    return apiClient.put(
      "/me/active-role",
      { role },
      { withCredentials: true }
    );
  },
};
