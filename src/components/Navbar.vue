<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-dark"
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      background-color: white;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    "
  >
    <div class="container-fluid">
      <span class="navbar-brand">電商平台</span>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <form @submit.prevent="searchProducts">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <input
                class="form-control me-2"
                type="search"
                placeholder="搜尋商品"
                aria-label="Search"
                v-model="keyword"
                required
              />
            </li>
            <li class="nav-item">&emsp;</li>
            <li class="nav-item">
              <button class="btn btn-outline-success" type="submit">
                搜尋
              </button>
            </li>
            <li class="nav-item">&emsp;</li>
          </ul>
        </form>

        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/"
              >首頁</router-link
            >
          </li>
          <li class="nav-item" v-if="!authStore.account">
            <router-link class="nav-link" to="/member/login">登入</router-link>
          </li>
          <li class="nav-item" v-if="!authStore.account">
            <router-link class="nav-link" to="/member/register"
              >註冊</router-link
            >
          </li>
          <li class="nav-item" v-if="authStore.account">
            <span class="nav-link disabled">{{ authStore.account }}</span>
          </li>
          <li class="nav-item" v-if="authStore.role === 'VENDOR'">
            <router-link class="nav-link" to="/product/add"
              >上架商品</router-link
            >
          </li>
          <li class="nav-item" v-if="authStore.role === 'VENDOR'">
            <router-link class="nav-link" to="/product/manage"
              >管理商品</router-link
            >
          </li>
          <li class="nav-item" v-if="authStore.account">
            <span class="nav-link" @click="logout" style="cursor: pointer"
              >登出</span
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- 這個空 div 用來補足 navbar 高度，避免下方內容被 navbar 擋住 -->
  <div style="height: 70px"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import Swal from "sweetalert2";

const apiBase = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();
const authStore = useAuthStore();
const keyword = ref("");

/* 登出 */
const logout = async () => {
  try {
    const response = await axios.post(`${apiBase}/api/logout`, null, {
      withCredentials: true,
    });

    authStore.logout();

    await Swal.fire({
      title: "登出成功",
      icon: "success",
      text: "確定後跳轉首頁",
      confirmButtonText: "確定",
    });

    router.replace("/");
  } catch (error) {
    console.log(error);
  }
};

/* 搜尋商品 */
const searchProducts = () => {
  router.push({
    path: "/index",
    query: {
      keyword: keyword.value,
    },
  });
};
</script>

<style></style>
