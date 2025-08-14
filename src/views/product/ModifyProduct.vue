<template>
  <div class="container mt-5">
    <h3>修改商品</h3>
    <form @submit.prevent="addProduct">
      <!-- 商品ID -->
      <div class="input-group mb-3">
        <input
          type="hidden"
          class="form-control"
          v-model="productId"
          readonly
        />
      </div>

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

      <!-- 圖片預覽 -->
      <div>
        <img
          id="preview"
          :src="
            photoPreview || ` http://localhost:8080/product/${productId}/photo`
          "
          class="img-thumbnail mb-2"
          style="max-width: 200px"
          alt="商品圖片"
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary"
        @click="modifyProduct(productId)"
      >
        送出
      </button>
      <a
        class="btn btn-secondary"
        @click="getProduct(productId)"
        style="margin-left: 10px"
        >重設</a
      >
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
import { useRoute } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

/* 商品相關變數 */
const route = useRoute();
const productId = route.query?.id;
const productName = ref();
const productDescription = ref();
const productPrice = ref();
const productQuantity = ref();
const productPhoto = ref();
const photoPreview = ref();

/* 獲取商品資訊 */
const getProduct = async (id) => {
  const response = await axios.get(`http://localhost:8080/api/product/${id}`);
  const data = response.data;
  productName.value = data.name;
  productDescription.value = data.description;
  productPrice.value = data.price;
  productQuantity.value = data.quantity;
  productPhoto.value = data.photo;
};
onMounted(() => getProduct(productId)); // 傳入一個「函式」，不是執行一個函式的結果

/* 追蹤上傳圖片 */
const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    productPhoto.value = file; // 表單圖片欄位賦值

    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

/* 修改商品 */
const modifyProduct = async (id) => {
  const formData = new FormData();
  formData.append("name", productName.value);
  formData.append("description", productDescription.value);
  formData.append("price", productPrice.value);
  formData.append("quantity", productQuantity.value);
  if (productPhoto.value instanceof File && productPhoto.value.size > 0) {
    formData.append("photo", productPhoto.value);
  }

  const ask = await Swal.fire({
    title: "確定修改？",
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
    const response = await axios.put(
      `http://localhost:8080/api/product/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    window.location.href = "/product/manage";
  } catch (error) {
    console.error("修改商品失敗:", error);
  }
};

/* 重設商品 */
</script>

<style></style>
