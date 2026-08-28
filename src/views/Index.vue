<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 頁面標題與數據簡介 -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">商品列表</h1>
        <p v-if="totalElements" class="text-sm text-gray-500 mt-1">
          總共有
          <span class="font-semibold text-blue-600">{{ totalElements }}</span>
          個商品
          <span v-if="keyword" class="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            搜尋：「{{ keyword }}」
          </span>
        </p>
      </div>

      <!-- 每頁顯示數量控制 -->
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <label for="sizeSelect" class="whitespace-nowrap">每頁顯示：</label>
        <select id="sizeSelect" v-model.number="pageSize" @change="handlePageChange"
          class="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-2.5 py-1.5 shadow-sm">
          <option :value="4">4 個</option>
          <option :value="8">8 個</option>
          <option :value="12">12 個</option>
        </select>
      </div>
    </div>

    <!-- 商品列表卡片牆 (Grid 響應式佈局) -->
    <div v-if="productList.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="product in productList" :key="product.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col justify-between group">
        <router-link :to="`/product/${product.id}`">
          <!-- 商品圖片區 -->
          <div class="w-full h-48 bg-gray-50 overflow-hidden relative">
            <img :src="`${apiBase}/api/product/${product.id}/photo`" :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              @error="onImageError" />
          </div>

          <!-- 商品資訊區 -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 line-clamp-1 mb-1">
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-500 line-clamp-2 mb-3">
                {{ product.description || "暫無商品描述" }}
              </p>
            </div>

            <!-- 賣家資訊 -->
            <div class="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>賣家</span>
              <span class="font-medium text-gray-600">
                👤 {{ product.vendor?.account || "官方賣家" }}
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 無商品時的提示區 -->
    <div v-else class="text-center py-16 bg-white rounded-xl border border-gray-100 mt-4">
      <p class="text-gray-500 text-lg">查無相關商品 🔍</p>
    </div>

    <!-- 分頁控制區 (Pagination) -->
    <div v-if="totalPages > 1"
      class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8 rounded-xl shadow-sm">
      <div class="flex flex-1 justify-between sm:hidden">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          上一頁
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          下一頁
        </button>
      </div>

      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            第 <span class="font-semibold">{{ currentPage + 1 }}</span> 頁，共
            <span class="font-semibold">{{ totalPages }}</span> 頁
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 0"
              class="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed">
              <span class="sr-only">上一頁</span>
              ◀ 上一頁
            </button>

            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages - 1"
              class="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-40 disabled:cursor-not-allowed">
              <span class="sr-only">下一頁</span>
              下一頁 ▶
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { productApi } from "@/api/productApi";

const apiBase = import.meta.env.VITE_API_BASE_URL;
const productList = ref([]);
const route = useRoute();
const pageSize = ref(0);
const currentPage = ref(0);
const keyword = ref(route.query.keyword || "");
const totalPages = ref(1);
const totalElements = ref();

const getProductList = async () => {
  const res = await productApi.getProducts(12, 0, keyword.value);

  pageSize.value = 12;
  currentPage.value = 0;
  productList.value = res.products;
  totalPages.value = res.totalPages;
  totalElements.value = res.totalElements;
};

const handlePage = async () => {
  const res = await productApi.getProducts(pageSize.value, currentPage.value, keyword.value);

  totalPages.value = res.totalPages;
  productList.value = res.products;

  if (currentPage.value > totalPages.value) {
    currentPage.value = 0;
    return handlePage();
  }
};

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < totalPages.value) {
    currentPage.value = newPage;
    handlePage();
  }
};

/* 圖片加載失敗備援 */
const onImageError = (event) => {
  event.target.src = "/images/no_image_available.jpg";
};

/* 切換每頁筆數 */
const handlePageChange = () => {
  currentPage.value = 0; // 重置為第一頁
  handlePage();
};

onMounted(getProductList);

watch(
  () => route.query,
  () => {
    currentPage.value = Number(route.query.page || 0);
    pageSize.value = Number(route.query.size || 5);
    keyword.value = route.query.keyword || "";
    getProductList();
  },
);
</script>

<style scoped></style>
