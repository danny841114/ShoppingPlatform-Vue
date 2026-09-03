import { defineStore } from "pinia";
import { memberApi } from "@/api/memberApi";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    account: null,
    roles: [],
    currentRole: null,
    userId: null,
    memberId: null,
    vendorId: null,
  }),

  actions: {
    async login(account, password) {
      try {
        const data = await memberApi.login(account, password);

        this.account = data.account;
        this.roles = data.roles;
        this.userId = data.userId;
        this.memberId = data.memberId;
        this.vendorId = data.vendorId;
        this.currentRole = "MEMBER";

        localStorage.setItem("currentRole", "MEMBER");
      } catch (error) {
        console.error("登入失敗", error);
        throw error;
      }
    },

    async fetchMe() {
      try {
        const data = await memberApi.fetchMe();

        this.account = data.account;
        this.roles = data.roles;
        this.userId = data.userId;
        this.memberId = data.memberId;
        this.vendorId = data.vendorId;

        const savedRole = localStorage.getItem("currentRole");

        if (savedRole && data.roles.includes(savedRole)) {
          this.currentRole = savedRole;
        } else {
          this.currentRole = data.roles[0];
          if (this.currentRole) {
            localStorage.setItem("currentRole", this.currentRole);
          }
        }
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
      await memberApi.logout();

      this.account = null;
      this.roles = [];
      this.userId = null;
      this.memberId = null;
      this.vendorId = null;
      this.currentRole = null;

      localStorage.removeItem("currentRole");
    },

    setRole(role) {
      const validRoles = ["MEMBER", "VENDOR"];
      if (validRoles.includes(role)) {
        this.currentRole = role;
        localStorage.setItem("currentRole", role);
      } else {
        console.warn("Invalid parameter as role:", role);
      }
    },
  },
});
