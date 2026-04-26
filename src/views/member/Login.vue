<template>
  <div
    class="container mt-5 justify-content-center align-items-center"
    style="width: 300px"
  >
    <h3 class="text-center">登入</h3>
    <div>
      <form @submit.prevent="handleLogin">
        <div class="input-group mb-3">
          <label class="input-group-text" for="account">帳號</label>
          <input
            id="account"
            type="text"
            class="form-control"
            aria-label="account"
            v-model="account"
            required
          />
        </div>

        <div class="input-group mb-3">
          <label class="input-group-text" for="password">密碼</label>
          <input
            id="password"
            type="password"
            class="form-control"
            aria-label="account"
            v-model="password"
            required
          />
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-primary">登入</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import Swal from "sweetalert2";

const apiBase = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();
const authStore = useAuthStore();
const account = ref("");
const password = ref("");
const errorMsg = ref("");

const handleLogin = async () => {
  try {
    const response = await axios.post(
      `${apiBase}/api/login`,
      {
        account: account.value,
        password: password.value,
      },
      { withCredentials: true },
    );

    authStore.setLogin({
      account: response.data.account,
      role: response.data.role,
    });

    await Swal.fire({
      title: "登入成功",
      icon: "success",
      text: "確定後跳轉首頁",
      confirmButtonText: "確定",
    });

    router.replace("/product/manage");
  } catch (error) {
    errorMsg.value = error.response.data.message;
    await Swal.fire({
      title: "登入失敗",
      icon: "error",
      text: errorMsg.value,
      confirmButtonText: "確定",
    });
  }
};
</script>

<style></style>
