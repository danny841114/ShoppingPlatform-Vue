<template>
  <div class="container mx-auto mt-8 px-4 max-w-6xl">
    <h3 class="mb-6 text-2xl font-bold text-gray-800">管理商品</h3>

    <!-- 表格外框與響應式橫向滾動區塊 -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th scope="col" class="px-4 py-3 text-center font-semibold">#</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">名稱</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">描述</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">價格</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">數量</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">上架日期</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">圖片</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 border-t border-gray-200">
          <tr v-for="(product, index) in productList" :key="product.id || index"
            class="h-24 hover:bg-gray-50 transition-colors">
            <!-- 序號 -->
            <th class="px-4 py-2 text-center font-medium text-gray-900" scope="row">
              {{ index + 1 }}
            </th>

            <!-- 名稱與描述 -->
            <td class="px-4 py-2 text-center text-gray-800">{{ product.name }}</td>
            <td class="px-4 py-2 text-center text-gray-600 max-w-xs truncate" :title="product.description">
              {{ product.description }}
            </td>

            <!-- 價格與數量 -->
            <td class="px-4 py-2 text-center text-gray-800 font-medium">${{ product.price }}</td>
            <td class="px-4 py-2 text-center text-gray-800">{{ product.quantity }}</td>

            <!-- 上架日期 -->
            <td class="px-4 py-2 text-center text-gray-500 text-xs">{{ product.date }}</td>

            <!-- 圖片 -->
            <td class="px-4 py-2 text-center">
              <div class="flex items-center justify-center">
                <img :src="`${apiBase}/api/product/${product.id}/photo`" alt="商品圖片"
                  class="h-20 w-20 object-contain rounded border border-gray-100 bg-gray-50" @error="
                    (event) => (event.target.src = '/images/no_image_available.jpg')
                  " />
              </div>
            </td>

            <!-- 操作按鈕區 -->
            <td class="px-4 py-2 text-center whitespace-nowrap">
              <div class="flex items-center justify-center gap-2">
                <router-link
                  class="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                  :to="{ path: '/product/modify', query: { id: product.id } }">
                  修改
                </router-link>
                <button type="button"
                  class="rounded bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                  @click="deleteProduct(product.id)">
                  刪除
                </button>
              </div>
            </td>
          </tr>

          <!-- 若無商品時的顯示 -->
          <tr v-if="productList.length === 0">
            <td colspan="8" class="px-4 py-8 text-center text-gray-400">
              目前尚無商品資料
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const apiBase = import.meta.env.VITE_API_BASE_URL;
const productList = ref([]);

/* 獲取商品列表 */
const getProductList = async () => {
  try {
    const response = await axios.get(`${apiBase}/api/product/vendor`, {
      withCredentials: true,
    });
    productList.value = response.data;
  } catch (error) {
    console.error("無法取得商品列表", error);
  }
};
onMounted(getProductList);

/* 刪除商品 */
const deleteProduct = async (id) => {
  const ask = await Swal.fire({
    title: "確定刪除？",
    icon: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "確認",
    cancelButtonText: "返回",
  });

  if (!ask.isConfirmed) {
    return;
  }

  try {
    const response = await axios.delete(`${apiBase}/api/product/${id}`, {
      withCredentials: true,
    });

    productList.value = productList.value.filter((product) => product.id !== id);

    Swal.fire({
      title: "已刪除",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("刪除失敗", error);
    const errMsg = error.response?.data?.message || "刪除商品失敗，請稍後再試";
    Swal.fire({
      title: "刪除失敗",
      text: errMsg,
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};
</script>

<style scoped></style>
