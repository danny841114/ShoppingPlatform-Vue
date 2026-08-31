<template>
  <div class="container mx-auto mt-8 px-4 max-w-6xl">
    <div class="mb-6 flex items-center justify-between">
      <h3 class="text-2xl font-bold text-gray-800">購物車</h3>

      <button type="button"
        class="rounded  bg-blue-800 px-3 py-3 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
        @click="checkOut">
        結帳
      </button>
    </div>

    <!-- 表格外框與響應式橫向滾動區塊 -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th scope="col" class="px-4 py-3 text-center font-semibold">
              <input type="checkbox" @click="cartStore.toggleSelectAll" v-model="cartStore.isAllSelected"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
            </th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">名稱</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">價格</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">數量</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">小計</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">圖片</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 border-t border-gray-200">
          <tr v-for="(item, index) in cartStore.cartItems" :key="item.id || index"
            class="h-24 hover:bg-gray-50 transition-colors">
            <!-- 核取方塊 -->
            <td class="px-4 py-2 text-center">
              <input type="checkbox" :value="item.id" v-model="cartStore.selectedItemIds"
                @click="cartStore.toggleSelectItem(item.id)"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
            </td>

            <!-- 名稱與描述 -->
            <td class="px-4 py-2 text-center text-gray-800">{{ item.product?.name }}</td>

            <!-- 價格與數量 -->
            <td class="px-4 py-2 text-center text-gray-800 font-medium">${{ item.product?.price }}</td>
            <td class="px-4 py-2 text-center text-gray-800">
              <button type="button"
                class="rounded  bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                :disabled="item.quantity <= 1" @click="changeQuantity(item, -1)">
                -
              </button>
              &nbsp;{{ getQuantity(item) }}&nbsp;
              <button type="button"
                class="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                :disabled="getQuantity(item) >= item.product?.quantity" @click="changeQuantity(item, 1)">
                +
              </button>
            </td>
            <td class="px-4 py-2 text-center text-gray-800 font-medium">${{ getSubtotal(item) }}</td>

            <!-- 圖片 -->
            <td class="px-4 py-2 text-center">
              <div class="flex items-center justify-center">
                <img :src="`${apiBase}/api/product/${item.product?.id}/photo`" alt="商品圖片"
                  class="h-20 w-20 object-contain rounded border border-gray-100 bg-gray-50" @error="
                    (event) => (event.target.src = '/images/no_image_available.jpg')
                  " />
              </div>
            </td>

            <!-- 操作按鈕區 -->
            <td class="px-4 py-2 text-center whitespace-nowrap">
              <div class="flex items-center justify-center gap-2">
                <button type="button"
                  class="rounded bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                  @click="deleteCartItem(item.id)">
                  刪除
                </button>
              </div>
            </td>
          </tr>

          <!-- 若無商品時的顯示 -->
          <tr v-if="cartStore.cartItems === 0">
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
import { reactive } from "vue";
import { debounce } from 'lodash-es'
import { cartApi } from "@/api/cartApi";
import { useCartStore } from '@/stores/cart'
import Swal from "sweetalert2";

const cartStore = useCartStore()
const apiBase = import.meta.env.VITE_API_BASE_URL;
const localQuantities = reactive({})

const getQuantity = (item) => {
  return localQuantities[item.id] ?? item.quantity
}

const getSubtotal = (item) => {
  const qty = getQuantity(item)
  return item.product?.price ? item.product.price * qty : item.subtotal
}

const debouncedUpdateQuantity = debounce(async (id, quantity) => {
  try {
    await cartApi.updateCartItemQuantity(id, quantity)
  } catch (error) {
    console.log("更新數量失敗", error)
  }
}, 2000)

const changeQuantity = (item, delta) => {
  const currentQty = getQuantity(item)
  const newQty = currentQty + delta

  if (newQty < 1) return

  localQuantities[item.id] = newQty

  debouncedUpdateQuantity(item.id, newQty)
}

/* 刪除商品 */
const deleteCartItem = async (id) => {
  const ask = await Swal.fire({
    title: "確定刪除？",
    icon: "warning",
    allowOutsideClick: false,
    showCancelButton: true,
    confirmButtonText: "確認",
    cancelButtonText: "返回",
  });

  if (!ask.isConfirmed) return;

  try {
    cartStore.removeItem(id)

    Swal.fire({
      title: "已刪除",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    const errMsg = error.response?.data?.message || "刪除商品失敗，請稍後再試";
    Swal.fire({
      title: "刪除失敗",
      text: errMsg,
      icon: "error",
      confirmButtonText: "確定",
    });
  }
};

const checkOut = () => {
  console.log("selected cart items:", selectedItemIds.value)

  if (selectedItemIds.value.length === 0) {
    Swal.fire({
      title: "結帳項目未選取",
      icon: "warning",
      timer: 1500,
      showConfirmButton: false,
    });

    return
  }

  // try {
  //   const res = orderApi.addOrder(selectedItemIds.value)
  //   console.log("add order response:", res)
  // } catch (error) {
  //   console.error("新增訂單失敗", error)
  // }
}
</script>

<style scoped></style>
