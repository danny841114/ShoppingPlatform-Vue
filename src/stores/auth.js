import { defineStore } from "pinia";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    account: null,
    role: null,
  }),

  actions: {
    setLogin(data) {
      this.account = data.account;
      this.role = data.role;
    },

    async fetchMe() {
      try {
        const response = await axios.get(`${apiBase}/api/me`, {
          withCredentials: true,
        });

        this.setLogin(response.data);
      } catch (e) {
        this.logout();
      }
    },

    logout() {
      this.account = null;
      this.role = null;
    },
  },
});
