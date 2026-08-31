<template>
  <nav class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-6">
          <span class="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
            電商平台
          </span>

          <div class="hidden md:flex items-center space-x-2">
            <form @submit.prevent="searchProducts" class="hidden sm:flex items-center space-x-2 flex-1 max-w-xs mx-4">
              <input type="search" placeholder="搜尋商品" v-model.trim="keyword" required
                class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" />
              <button type="submit"
                class="px-3 py-1.5 border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white text-sm font-medium rounded-lg transition whitespace-nowrap">
                搜尋
              </button>
            </form>

            <router-link to="/"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
              active-class="text-blue-600 font-semibold bg-blue-50">
              首頁
            </router-link>

            <template v-if="authStore.role === 'MEMBER'">
              <router-link to="/cart"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
                active-class="text-blue-600 font-semibold bg-blue-50">
                購物車
              </router-link>
            </template>

            <template v-if="authStore.role === 'VENDOR'">
              <router-link to="/product/add"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
                active-class="text-blue-600 font-semibold bg-blue-50">
                上架商品
              </router-link>

              <router-link to="/product/manage"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition"
                active-class="text-blue-600 font-semibold bg-blue-50">
                管理商品
              </router-link>
            </template>
          </div>
        </div>

        <div class="hidden md:flex items-center space-x-4">
          <template v-if="!authStore.account">
            <router-link to="/member/login" class="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
              登入
            </router-link>
            <router-link to="/member/register"
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm">
              註冊
            </router-link>
          </template>

          <template v-else>
            <span class="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              👤 {{ authStore.account }}
            </span>
            <button @click="logout"
              class="text-sm font-medium text-red-600 hover:text-red-700 transition focus:outline-none">
              登出
            </button>
          </template>
        </div>

        <!-- 手機版漢堡選單按鈕 (md 以下顯示) -->
        <div class="md:hidden flex items-center">
          <button @click="isOpen = !isOpen" type="button"
            class="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-md" aria-label="Toggle Navigation">
            <!-- 漢堡圖示 / 關閉圖示 動態切換 -->
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- 手機版展開選單 (點擊漢堡按鈕後顯示) -->
    <div v-show="isOpen" class="md:hidden border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 bg-white shadow-lg">
      <form @submit.prevent="searchProducts" class="flex items-center space-x-2 my-2">
        <input type="search" placeholder="搜尋商品..." v-model.trim="keyword" required
          class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <button type="submit"
          class="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg whitespace-nowrap">
          搜尋
        </button>
      </form>

      <router-link to="/" @click="isOpen = false"
        class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
        首頁
      </router-link>

      <template v-if="!authStore.account">
        <router-link to="/member/login" @click="isOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
          登入
        </router-link>

        <router-link to="/member/register" @click="isOpen = false"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
          註冊
        </router-link>
      </template>

      <template v-else>
        <template v-if="authStore.role === 'MEMBER'">
          <router-link to="/cart" @click="isOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            購物車
          </router-link>
        </template>

        <template v-if="authStore.role === 'VENDOR'">
          <router-link to="/product/add" @click="isOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            上架商品
          </router-link>

          <router-link to="/product/manage" @click="isOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            管理商品
          </router-link>
        </template>

        <div class="px-3 py-2 text-sm font-medium text-gray-500">
          帳號：{{ authStore.account }}
        </div>

        <button @click="() => { logout(); isOpen = false; }"
          class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
          登出
        </button>
      </template>
    </div>
  </nav>

  <div class="h-16"></div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { memberApi } from "@/api/memberApi";
import Swal from "sweetalert2";

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const keyword = ref("");
const isOpen = ref(false); // 控制手機版漢堡選單開關

/* 登出 */
const logout = async () => {
  try {
    await memberApi.logout()

    authStore.logout();

    cartStore.clearCart();

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
    path: "/product",
    query: {
      keyword: keyword.value,
    },
  });
};
</script>

<style scoped></style>
