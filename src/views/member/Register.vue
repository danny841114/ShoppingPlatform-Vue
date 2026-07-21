<template>
  <div class="mx-auto mt-12 w-80 p-4">
    <h3 class="mb-6 text-center text-2xl font-bold text-gray-800">註冊</h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- 帳號輸入框組合 -->
      <div>
        <div
          class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <label for="account"
            class="flex items-center whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
            帳號
          </label>
          <input id="account" type="text" class="w-full px-3 py-2 text-sm text-gray-800 outline-none" v-model="account"
            required @blur="accountTouched = true" />
        </div>
        <p v-if="accountError" class="mt-1 text-xs text-red-500 text-center">
          {{ accountError }}
        </p>
      </div>

      <!-- 密碼輸入框組合 -->
      <div>
        <div
          class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <label for="password"
            class="flex items-center whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
            密碼
          </label>
          <input id="password" type="password" class="w-full px-3 py-2 text-sm text-gray-800 outline-none"
            v-model="password" required @blur="passwordTouched = true" />
        </div>
        <p v-if="passwordError" class="mt-1 text-xs text-red-500 text-center">
          {{ passwordError }}
        </p>
      </div>

      <!-- 密碼確認輸入框組合 -->
      <div>
        <div
          class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <label for="passwordConfirm"
            class="flex items-center whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
            密碼確認
          </label>
          <input id="passwordConfirm" type="password" class="w-full px-3 py-2 text-sm text-gray-800 outline-none"
            v-model="passwordConfirm" required @blur="passwordConfirmTouched = true" />
        </div>
        <p v-if="passwordConfirmError" class="mt-1 text-xs text-red-500 text-center">
          {{ passwordConfirmError }}
        </p>
      </div>

      <!-- 註冊按鈕 -->
      <div class="text-center pt-2">
        <button type="submit"
          class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          註冊
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

const apiBase = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();
const account = ref("");
const password = ref("");
const passwordConfirm = ref("");
const accountTouched = ref(false);
const passwordTouched = ref(false);
const passwordConfirmTouched = ref(false);

// 錯誤訊息
const accountError = computed(() => {
  if (!accountTouched.value) return "";

  const regex = /^[a-zA-Z0-9_]{4,20}$/;
  if (!regex.test(account.value)) {
    return "帳號需4-20碼且只能是英數字與底線";
  }
  return "";
});

const passwordError = computed(() => {
  if (!passwordTouched.value) return "";

  if (password.value.length < 8) {
    return "密碼至少8碼";
  }
  return "";
});

const passwordConfirmError = computed(() => {
  if (!passwordConfirmTouched.value) return "";

  if (password.value !== passwordConfirm.value) {
    return "確認密碼欄位內容不同";
  }
  return "";
});

const handleSubmit = async () => {
  accountTouched.value = true;
  passwordTouched.value = true;
  passwordConfirmTouched.value = true;

  if (accountError.value || passwordError.value || passwordConfirmError.value) {
    console.error("註冊失敗", "帳號或密碼格式有誤");
    Swal.fire({
      title: "註冊失敗",
      text: "帳號或密碼格式有誤",
      icon: "error",
      confirmButtonText: "確定",
    });
    return;
  }

  try {
    const response = await axios.post(`${apiBase}/api/register`, {
      account: account.value,
      password: password.value,
    });

    console.log("註冊成功", response.data);
    await Swal.fire({
      title: "註冊成功",
      icon: "success",
      text: "確定後跳轉首頁",
      confirmButtonText: "確定",
    });

    router.push("/");
  } catch (error) {
    console.error("註冊失敗", error);
    const errorMessage = error.response?.data?.error || "註冊失敗，請稍後再試";
    Swal.fire({
      title: "註冊失敗",
      text: errorMessage,
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};
</script>

<style scoped></style>
