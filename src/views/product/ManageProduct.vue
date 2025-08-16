<template>
  <div class="container mt-5">
    <h3>管理商品</h3>
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col" class="text-center">#</th>
          <th scope="col" class="text-center">名稱</th>
          <th scope="col" class="text-center">描述</th>
          <th scope="col" class="text-center">價格</th>
          <th scope="col" class="text-center">數量</th>
          <th scope="col" class="text-center">上架日期</th>
          <th scope="col" class="text-center">圖片</th>
          <th scope="col" class="text-center">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          style="height: 100px"
          v-for="(product, index) in productList"
          :key="index"
        >
          <th class="align-middle text-center" scope="row">
            {{ index + 1 }}
          </th>
          <td class="align-middle text-center">{{ product.name }}</td>
          <td class="align-middle text-center">
            {{ product.description }}
          </td>
          <td class="align-middle text-center">
            {{ product.price }}
          </td>
          <td class="align-middle text-center">
            {{ product.quantity }}
          </td>
          <td class="align-middle text-center">
            {{ product.date }}
          </td>
          <td class="align-middle text-center">
            <img
              :src="`${apiBase}/api/product/${product.id}/photo`"
              alt="商品圖片"
              height="80"
              @error="
                (event) => (event.target.src = '/images/no_image_available.jpg')
              "
            />
          </td>
          <td class="align-middle text-center">
            <a class="btn btn-success" @click="modifyProduct(product.id)"
              >修改</a
            >
            <a
              type="button"
              class="btn btn-danger"
              @click="deleteProduct(product.id)"
              style="margin-left: 10px"
              >刪除</a
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";
const apiBase = import.meta.env.VITE_API_BASE_URL;

const router = useRouter();
const productList = ref([]);

/* 獲取 Cookie */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
const jwt = getCookie("jwt");

/* 獲取商品列表 */
const getProductList = async () => {
  const response = await axios.get(`${apiBase}/api/product/vendor`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  productList.value = response.data;
};
onMounted(getProductList);

/* 修改商品 */
const modifyProduct = async (id) => {
  router.push({ path: "/product/modify", query: { id } });
};

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

  const response = await axios.delete(`${apiBase}/api/product/${id}`);

  productList.value = productList.value.filter((product) => product.id !== id);
};
</script>

<style></style>
