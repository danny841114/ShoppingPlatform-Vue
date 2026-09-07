import { defineStore } from "pinia";
import { ref } from "vue";
import { authApi } from "@/api/user/authApi";
import { userApi } from "@/api/user/userApi";

export const useAuthStore = defineStore("auth", () => {
  // --- State ---
  const account = ref(null);
  const roles = ref([]);
  const currentRole = ref(null);
  const userId = ref(null);
  const memberId = ref(null);
  const vendorId = ref(null);

  // --- Actions ---
  const login = async (accountInput, password) => {
    try {
      const data = await authApi.login(accountInput, password);

      account.value = data.account;
      roles.value = data.roles;
      userId.value = data.userId;
      memberId.value = data.memberId;
      vendorId.value = data.vendorId;
      currentRole.value = "MEMBER";

      localStorage.setItem("currentRole", "MEMBER");
    } catch (error) {
      console.error("登入失敗", error);
      throw error;
    }
  };

  const fetchMe = async () => {
    try {
      const data = await userApi.fetchMe();

      account.value = data.account;
      roles.value = data.roles;
      userId.value = data.userId;
      memberId.value = data.memberId;
      vendorId.value = data.vendorId;

      const savedRole = localStorage.getItem("currentRole");

      if (savedRole && data.roles.includes(savedRole)) {
        currentRole.value = savedRole;
      } else {
        currentRole.value = data.roles[0] || null;
        if (currentRole.value) {
          localStorage.setItem("currentRole", currentRole.value);
        }
      }
    } catch (error) {
      const statusCode = error.response?.status;
      if (statusCode && (statusCode === 401 || statusCode === 403)) {
        console.log("尚未登入");
      } else {
        console.error("無法取得使用者資訊", error);
      }
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();

      account.value = null;
      roles.value = [];
      userId.value = null;
      memberId.value = null;
      vendorId.value = null;
      currentRole.value = null;

      localStorage.removeItem("currentRole");
    } catch (error) {
      console.error("登出失敗", error);
      throw error;
    }
  };

  const setRole = async (role) => {
    const validRoles = ["MEMBER", "VENDOR"];

    try {
      if (validRoles.includes(role)) {
        await userApi.setRole(role);

        currentRole.value = role;
        localStorage.setItem("currentRole", role);
      } else {
        console.warn("角色參數不合法", role);
      }
    } catch (error) {
      console.error("轉換角色失敗", error);
      throw error;
    }
  };

  return {
    account,
    roles,
    currentRole,
    userId,
    memberId,
    vendorId,
    login,
    fetchMe,
    logout,
    setRole,
  };
});
