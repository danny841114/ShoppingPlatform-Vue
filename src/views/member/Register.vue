<template>
  <div
    class="container mt-5 justify-content-center align-items-center"
    style="width: 300px"
  >
    <h3 class="text-center">註冊</h3>
    <form @submit.prevent="handleSubmit">
      <div class="input-group mb-3">
        <label class="input-group-text" for="account">帳　　號</label>
        <input
          type="text"
          class="form-control"
          v-model="account"
          id="account"
          required
          @blur="accountTouched = true"
        />
      </div>

      <div class="input-group mb-3">
        <label class="input-group-text" for="password">密　　碼</label>
        <input
          type="password"
          class="form-control"
          v-model="password"
          id="password"
          required
          @blur="passwordTouched = true"
        />
      </div>

      <div class="input-group mb-3">
        <label class="input-group-text" for="passwordConfirm">密碼確認</label>
        <input
          type="password"
          class="form-control"
          v-model="passwordConfirm"
          id="passwordConfirm"
          required
          @blur="passwordConfirmTouched = true"
        />
      </div>

      <div class="text-center">
        <button type="submit" class="btn btn-primary">註冊</button>
      </div>

      <div class="mb-3 text-danger text-center">&nbsp;</div>
      <div class="mb-3 text-danger text-center" v-if="accountError">
        {{ accountError }}
      </div>
      <div class="mb-3 text-danger text-center" v-if="passwordError">
        {{ passwordError }}
      </div>
      <div class="mb-3 text-danger text-center" v-if="passwordConfirmError">
        {{ passwordConfirmError }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
const apiBase = import.meta.env.VITE_API_BASE_URL;

// 欄位資料
const account = ref("");
const password = ref("");
const passwordConfirm = ref("");

// 是否已經編輯過（焦點離開後才顯示錯誤訊息）
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

    window.location.href = "/";
  } catch (error) {
    console.error("註冊失敗", error);
    Swal.fire({
      title: "註冊失敗",
      text: error.response?.data?.error,
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};
</script>

<style></style>
