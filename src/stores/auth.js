import { defineStore } from "pinia";
import { memberApi } from "@/api/memberApi";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    account: null,
    role: null,
  }),

  actions: {
    async login(account, password) {
      try {
        const data = await memberApi.login(account, password);
        this.account = data.account;
        this.role = data.role;
      } catch (error) {
        console.error("登入失敗", error);
        throw error;
      }
    },

    async fetchMe() {
      try {
        const data = await memberApi.fetchMe();
        this.account = data.account;
        this.role = data.role;
      } catch (error) {
        const statusCode = error.response?.status;
        if (statusCode && statusCode === 401) {
          console.error("尚未登入");
        } else {
          console.error("無法取得使用者資訊", error);
        }

        this.logout();
      }
    },

    async logout() {
      await memberApi.logout()
      this.account = null;
      this.role = null;
    },
  },
});
