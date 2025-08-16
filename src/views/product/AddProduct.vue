<template>
  <div class="container mt-5">
    <h3>上架商品</h3>
    <form @submit.prevent="addProduct">
      <!-- 商品名稱 -->
      <div class="input-group mb-3">
        <label class="input-group-text" for="name">名稱</label>
        <input
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
          class="form-control"
          rows="3"
          v-model="productDescription"
        ></textarea>
      </div>

      <!-- 商品價格 -->
      <div class="input-group mb-3">
        <label class="input-group-text" for="price">價格</label>
        <input
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
        <input type="file" class="form-control" @change="handlePhotoChange" />
      </div>

      <button type="submit" class="btn btn-primary" @click="addProduct">
        送出
      </button>
      <a
        class="btn btn-secondary"
        href="/product/manage"
        style="margin-left: 10px"
        >返回</a
      >
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
const apiBase = import.meta.env.VITE_API_BASE_URL;

/* 商品相關變數 */
const productName = ref();
const productDescription = ref();
const productPrice = ref();
const productQuantity = ref();
const productPhoto = ref(null);

/* 登入相關變數 */
const isLogin = ref(false);
const account = ref("");
const role = ref("");

/* 獲取 Cookie */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

/* 解析 JWT */
function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

/* 取得使用者資訊 */
function getAccount() {
  const jwt = getCookie("jwt");
  if (jwt) {
    const payload = parseJwt(jwt);
    if (payload) {
      isLogin.value = true;
      account.value = payload.sub || "";
      role.value = payload.role || "";
    }
  }
}

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

  const jwt = getCookie("jwt");
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
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "multipart/form-data",
      },
    });
    window.location.href = "/product/manage";
  } catch (error) {
    console.error("新增商品失敗:", error);
  }
};
</script>

<style></style>
