<template>
  <div class="mx-auto mt-8 max-w-xl p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
    <h3 class="mb-6 text-2xl font-bold text-gray-800">上架商品</h3>

    <form @submit.prevent="addProduct" class="space-y-4">
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

      <!-- 商品圖片 -->
      <div>
        <div
          class="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
          <label for="photo"
            class="flex items-center whitespace-nowrap bg-gray-100 px-3 text-sm text-gray-600 border-r border-gray-300">
            圖片
          </label>
          <input id="photo" type="file" accept="image/*" :key="fileInputKey"
            class="w-full px-3 py-1.5 text-sm text-gray-600 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none"
            @change="handlePhotoChange" />
        </div>

        <!-- 圖片預覽與移除按鈕區塊 -->
        <div v-if="photoPreview"
          class="mt-3 flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
          <div class="flex items-center gap-3">
            <img :src="photoPreview" alt="預覽圖片" class="h-16 w-16 object-cover rounded border border-gray-300" />
            <span class="text-xs text-gray-500">已選擇圖片</span>
          </div>

          <!-- 移除按鈕 -->
          <button type="button"
            class="rounded bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600 border border-rose-200 transition-colors hover:bg-rose-100 focus:outline-none"
            @click="removePhoto">
            移除圖片
          </button>
        </div>
      </div>

      <!-- 操作按鈕區 -->
      <div class="flex items-center gap-3 pt-4">
        <button type="submit"
          class="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          送出
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { productApi } from "@/api/productApi";
import Swal from "sweetalert2";

const router = useRouter();
const productName = ref("");
const productDescription = ref("");
const productPrice = ref("");
const productQuantity = ref("");
const productPhoto = ref(null);
const photoPreview = ref(null);
const fileInput = ref(null);
const fileInputKey = ref(Date.now()); // 用於強制重新渲染 input

/* 追蹤上傳圖片 */
const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    productPhoto.value = file;
    photoPreview.value = URL.createObjectURL(file);
  } else {
    productPhoto.value = null;
    photoPreview.value = null;
  }
};

/* 移除圖片 */
const removePhoto = () => {
  productPhoto.value = null;
  photoPreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = ""; // 清空 HTML input 的選取檔案狀態
  }
  fileInputKey.value = Date.now(); // 強制重新渲染，100% 移除顯示的檔名
};

/* 新增商品 */
const addProduct = async () => {
  const ask = await Swal.fire({
    title: "確定新增？",
    icon: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "確認",
    cancelButtonText: "返回",
  });

  if (!ask.isConfirmed) return;

  try {
    await productApi.addProduct(
      productName.value,
      productDescription.value,
      productPrice.value,
      productQuantity.value,
      productPhoto.value
    );

    router.push("/product/manage");
  } catch (error) {
    console.error("新增商品失敗:", error);
    Swal.fire({
      title: "新增失敗",
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};
</script>

<style scoped></style>
