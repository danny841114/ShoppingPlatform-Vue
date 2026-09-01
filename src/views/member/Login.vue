<template>
  <div class="mx-auto mt-12 w-80 p-4">
    <h3 class="mb-6 text-center text-2xl font-bold text-gray-800">登入</h3>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <!-- 帳號輸入框組合 -->
      <div
        class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <label for="account"
          class="flex items-center whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
          帳號
        </label>
        <input id="account" type="text" class="w-full px-3 py-2 text-sm text-gray-800 outline-none" v-model="account"
          required />
      </div>

      <!-- 密碼輸入框組合 -->
      <div
        class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <label for="password"
          class="flex items-center whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
          密碼
        </label>
        <input id="password" type="password" class="w-full px-3 py-2 text-sm text-gray-800 outline-none"
          v-model="password" required />
      </div>

      <!-- 登入按鈕 -->
      <div class="text-center pt-2">
        <button type="submit"
          class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          登入
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import Swal from "sweetalert2";

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const account = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    await authStore.login(account.value, password.value)

    await cartStore.fetchCart();

    await Swal.fire({
      title: "登入成功",
      icon: "success",
      text: "確定後跳轉首頁",
      confirmButtonText: "確定",
    });

    router.replace("/");
  } catch (error) {
    await Swal.fire({
      title: "登入失敗",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};
</script>

<style scoped></style>
