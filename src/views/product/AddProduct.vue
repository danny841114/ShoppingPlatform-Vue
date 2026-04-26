<template>
  <div class="container mt-5">
    <h3>上架商品</h3>
    <form @submit.prevent="addProduct">
      <!-- 商品名稱 -->
      <div class="input-group mb-3">
        <label class="input-group-text" for="name">名稱</label>
        <input
          id="name"
          type="text"
          class="form-control"
          v-model="productName"
          required
        />
      </div>

      <!-- 商品描述 -->
      <div class="input-group mb-3">
        <label class="input-group-text" for="description">描述</label>
        <textarea
          id="description"
          class="form-control"
          rows="3"
          v-model="productDescription"
        ></textarea>
      </div>

      <!-- 商品價格 -->
      <div class="input-group mb-3">
        <label class="input-group-text" for="price">價格</label>
        <input
          id="price"
          type="number"
          class="form-control"
          min="1"
          v-model="productPrice"
          required
        />
      </div>

      <!-- 商品數量 -->
      <div class="input-group mb-3">
        <label class="input-group-text" for="quantity">數量</label>
        <input
          id="quantity"
          type="number"
          class="form-control"
          min="1"
          v-model="productQuantity"
          required
        />
      </div>

      <!-- 商品圖片 -->
      <div class="input-group mb-3">
        <label class="input-group-text" for="photo">圖片</label>
        <input
          id="photo"
          type="file"
          class="form-control"
          @change="handlePhotoChange"
        />
      </div>

      <button type="submit" class="btn btn-primary">送出</button>
      <router-link
        class="btn btn-secondary"
        to="/product/manage"
        style="margin-left: 10px"
        >返回</router-link
      >
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

const router = useRouter();
const apiBase = import.meta.env.VITE_API_BASE_URL;
const productName = ref();
const productDescription = ref();
const productPrice = ref();
const productQuantity = ref();
const productPhoto = ref(null);

/* 追蹤上傳圖片 */
const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    productPhoto.value = file;
  }
};

/* 新增商品 */
const addProduct = async () => {
  const formData = new FormData();
  formData.append("name", productName.value);
  formData.append("description", productDescription.value);
  formData.append("price", productPrice.value);
  formData.append("quantity", productQuantity.value);
  if (productPhoto.value) {
    formData.append("photo", productPhoto.value);
  }

  const ask = await Swal.fire({
    title: "確定新增？",
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
    const response = await axios.post(`${apiBase}/api/product`, formData, {
      withCredentials: true,
    });
    router.push("/product/manage");
  } catch (error) {
    console.error("新增商品失敗:", error);
  }
};
</script>

<style></style>
