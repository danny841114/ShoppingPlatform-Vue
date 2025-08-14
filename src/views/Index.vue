<template>
  <div class="container mt-5">
    <h3>商品列表</h3>

    <!-- 簡介 -->
    <div class="mt-2" v-if="totalElements">
      總共有 {{ totalElements }} 個商品
    </div>

    <!-- 每頁顯示數量 -->
    <div class="mt-2">
      <form>
        <label for="sizeSelect">每頁顯示&emsp;</label>
        <select v-model="pageSize" id="sizeSelect" @change="handlePage">
          <option :value="4">4</option>
          <option :value="8">8</option>
          <option :value="12">12</option>
        </select>
        <span>&emsp;個商品</span>
      </form>
    </div>

    <!-- 分頁按鈕 -->
    <div class="mt-2">
      <button
        class="btn btn-primary"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 0"
      >
        上一頁
      </button>

      <span>&emsp;第 {{ currentPage + 1 }} 頁&emsp;</span>

      <button
        class="btn btn-primary"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
      >
        下一頁
      </button>

      <span>&emsp;共 {{ totalPages }} 頁&emsp;</span>
    </div>

    <!-- 商品列表 -->
    <div class="row mt-3">
      <div
        class="col-md-3 mb-4"
        v-for="(product, index) in productList"
        :key="index"
      >
        <div class="card" style="width: 18rem">
          <img
            :src="`http://localhost:8080/product/${product.id}/photo`"
            class="card-img-top p-4"
            alt="Product Image"
            @error="
              (event) => (event.target.src = '/images/no_image_available.jpg')
            "
          />
          <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">{{ product.description }}</p>
            <p class="card-text">{{ product.vendor?.account }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const productList = ref([]);
const route = useRoute();
const pageSize = ref(0);
const currentPage = ref(0);
const keyword = ref(route.query.keyword || "");
const totalPages = ref(1);
const totalElements = ref();

const getProductList = async () => {
  if (keyword.value) {
    // 若有關鍵字，走搜尋邏輯
    const response = await axios.get(
      "http://localhost:8080/api/product/filter",
      {
        params: {
          size: 12,
          page: 0,
          keyword: keyword.value,
        },
      }
    );
    pageSize.value = 12;
    currentPage.value = 0;
    productList.value = response.data.products;
    totalPages.value = response.data.totalPages;
    totalElements.value = response.data.totalElements;
  } else {
    // 無關鍵字，載入全部
    const response = await axios.get("http://localhost:8080/api/product");
    productList.value = response.data;
    totalElements.value = response.data.length;
  }
};

const handlePage = async () => {
  const response = await axios.get("http://localhost:8080/api/product/filter", {
    params: {
      size: pageSize.value,
      page: currentPage.value,
      keyword: keyword.value,
    },
  });

  totalPages.value = response.data?.totalPages;
  if (currentPage.value > totalPages.value) {
    currentPage.value = 0;
    return handlePage();
  }
  productList.value = response.data?.products;
};

const changePage = (newPage) => {
  if (newPage >= 0 && newPage < totalPages.value) {
    currentPage.value = newPage;
    handlePage();
  }
};

onMounted(getProductList);
watch(
  () => route.query,
  () => {
    currentPage.value = Number(route.query.page || 0);
    pageSize.value = Number(route.query.size || 5);
    keyword.value = route.query.keyword || "";
    getProductList();
  }
);
</script>

<style></style>
