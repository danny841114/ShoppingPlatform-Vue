<template>
  <div class="mx-auto mt-8 max-w-xl p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
    <h3 class="mb-6 text-2xl font-bold text-gray-800">修改商品</h3>

    <form @submit.prevent="modifyProduct" class="space-y-4">
      <!-- 商品ID (隱藏) -->
      <input type="hidden" v-model="productId" readonly />

      <!-- 商品名稱 -->
      <div
        class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <label for="name"
          class="flex items-center whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
          名稱
        </label>
        <input id="name" type="text" class="w-full px-3 py-2 text-sm text-gray-800 outline-none" v-model="productName"
          required />
      </div>

      <!-- 商品描述 -->
      <div
        class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <label for="description"
          class="flex items-start pt-2.5 whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
          描述
        </label>
        <textarea id="description" rows="3" class="w-full px-3 py-2 text-sm text-gray-800 outline-none resize-y"
          v-model="productDescription"></textarea>
      </div>

      <!-- 商品價格 -->
      <div
        class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <label for="price"
          class="flex items-center whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
          價格
        </label>
        <input id="price" type="number" min="1" class="w-full px-3 py-2 text-sm text-gray-800 outline-none"
          v-model="productPrice" required />
      </div>

      <!-- 商品數量 -->
      <div
        class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <label for="quantity"
          class="flex items-center whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
          數量
        </label>
        <input id="quantity" type="number" min="1" class="w-full px-3 py-2 text-sm text-gray-800 outline-none"
          v-model="productQuantity" required />
      </div>

      <!-- 商品圖片上傳 -->
      <div>
        <div
          class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <label for="photo"
            class="flex items-center whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
            圖片
          </label>
          <input id="photo" ref="fileInput" :key="fileInputKey" type="file" accept="image/*"
            class="w-full px-3 py-1.5 text-sm text-gray-600 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none"
            @change="handlePhotoChange" />
        </div>

        <!-- 圖片預覽區塊 -->
        <div class="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
          <div class="flex items-center gap-3">
            <img id="preview" :src="photoPreview || `${apiBase}/api/product/${productId}/photo`"
              class="h-20 w-20 object-contain rounded border border-gray-300 bg-white" alt="商品圖片" @error="
                (event) => (event.target.src = '/images/no_image_available.jpg')
              " />
            <span class="text-xs text-gray-500">
              {{ photoPreview ? '新選擇預覽圖' : '目前線上圖片' }}
            </span>
          </div>

          <!-- 若有新選圖片，提供取消新圖片的按鈕 -->
          <button v-if="photoPreview" type="button"
            class="rounded bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 border border-rose-200 transition-colors hover:bg-rose-100 focus:outline-none"
            @click="clearSelectedPhoto">
            取消替換圖片
          </button>
        </div>
      </div>

      <!-- 操作按鈕區 -->
      <div class="flex items-center gap-3 pt-4">
        <button type="submit"
          class="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          送出
        </button>
        <button type="button"
          class="rounded-md border border-gray-300 bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          @click="resetForm">
          重設
        </button>
        <router-link to="/product/manage"
          class="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
          返回
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { productApi } from "@/api/productApi";
import Swal from "sweetalert2";

const apiBase = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();
const route = useRoute();
const productId = route.query?.id;
const productName = ref("");
const productDescription = ref("");
const productPrice = ref("");
const productQuantity = ref("");
const productPhoto = ref(null)
const photoPreview = ref(null);
const fileInput = ref(null);
const fileInputKey = ref(Date.now());

/* 獲取商品資訊 */
const getProduct = async () => {
  try {
    const res = await productApi.getProductById(productId);

    productName.value = res.name;
    productDescription.value = res.description || "";
    productPrice.value = res.price;
    productQuantity.value = res.quantity;

    // 清空手動選擇的圖片狀態
    clearSelectedPhoto();
  } catch (error) {
    console.error("獲取商品資料失敗:", error);
  }
};

/* 追蹤上傳圖片 */
const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    productPhoto.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    clearSelectedPhoto();
  }
};

/* 清除新選擇的圖片狀態（還原顯示原本的線上記錄） */
const clearSelectedPhoto = () => {
  productPhoto.value = null;
  photoPreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
  fileInputKey.value = Date.now();
};

/* 重設整個表單 */
const resetForm = getProduct

/* 修改商品 */
const modifyProduct = async () => {
  const ask = await Swal.fire({
    title: "確定修改？",
    icon: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "確認",
    cancelButtonText: "返回",
  });

  if (!ask.isConfirmed) return;

  try {
    await productApi.updateProduct(
      productId,
      productName.value,
      productDescription.value,
      productPrice.value,
      productQuantity.value,
      productPhoto.value
    );

    router.push("/product/manage");
  } catch (error) {
    console.error("修改商品失敗:", error);
    Swal.fire({
      title: "更新失敗",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

onMounted(getProduct);
</script>

<style scoped></style>
