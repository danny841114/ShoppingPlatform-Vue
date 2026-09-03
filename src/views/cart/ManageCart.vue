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

    <div class="space-y-6">
      <!-- 若無商品時的顯示 -->
      <div v-if="cartStore.cartItems.length === 0"
        class="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400">
        目前購物車尚無商品資料
      </div>

      <!-- 按 Vendor 分組循環 -->
      <div v-else v-for="group in groupedCartItems" :key="group.vendorId"
        class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">

        <!-- 商家標頭區塊 -->
        <div class="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800">
          <input type="checkbox"
            :checked="group.items.every(item => cartStore.selectedItemIds.includes(item.id)) && group.items.length > 0"
            :disabled="cartStore.activeVendorId && cartStore.activeVendorId !== group.vendorId"
            @change="cartStore.toggleVendorAll(group.items)"
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" />
          <span class="text-blue-600">🏪</span>
          <span>{{ group.shopName }}</span>
        </div>

        <!-- 該商家的商品表格 -->
        <table class="w-full border-collapse text-left text-sm text-gray-500">
          <thead class="bg-gray-50/50 text-gray-700">
            <tr>
              <th scope="col" class="w-12 px-4 py-3 text-center">選擇</th>
              <th scope="col" class="px-4 py-3 text-center font-semibold">商品名稱</th>
              <th scope="col" class="w-32 px-4 py-3 text-center font-semibold">單價</th>
              <th scope="col" class="w-40 px-4 py-3 text-center font-semibold">數量</th>
              <th scope="col" class="w-32 px-4 py-3 text-center font-semibold">小計</th>
              <th scope="col" class="w-28 px-4 py-3 text-center font-semibold">圖片</th>
              <th scope="col" class="w-24 px-4 py-3 text-center font-semibold">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in group.items" :key="item.id" class="h-24 transition-colors hover:bg-gray-50">

              <!-- 核取方塊 -->
              <td class="px-4 py-2 text-center">
                <input type="checkbox" :checked="cartStore.selectedItemIds.includes(item.id)"
                  :disabled="cartStore.activeVendorId && cartStore.activeVendorId !== item.product?.vendor?.id"
                  @change="cartStore.toggleSelectItem(item)"
                  class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              </td>

              <!-- 名稱 -->
              <td class="px-4 py-2 text-center text-gray-800">{{ item.product?.name }}</td>

              <!-- 價格與數量 -->
              <td class="px-4 py-2 text-center font-medium text-gray-800">${{ item.product?.price }}</td>
              <td class="px-4 py-2 text-center text-gray-800">
                <div class="flex items-center justify-center gap-1">
                  <button type="button"
                    class="rounded bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                    :disabled="getQuantity(item) <= 1" @click="changeQuantity(item, -1)">
                    -
                  </button>
                  <span class="w-8 text-center">{{ getQuantity(item) }}</span>
                  <button type="button"
                    class="rounded bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                    :disabled="getQuantity(item) >= item.product?.quantity" @click="changeQuantity(item, 1)">
                    +
                  </button>
                </div>
              </td>

              <!-- 小計 -->
              <td class="px-4 py-2 text-center font-medium text-gray-800">${{ getSubtotal(item) }}</td>

              <!-- 圖片 -->
              <td class="px-4 py-2 text-center">
                <div class="flex items-center justify-center">
                  <img :src="`${apiBase}/api/product/${item.product?.id}/photo`" alt="商品圖片"
                    class="h-16 w-16 rounded border border-gray-100 bg-gray-50 object-contain"
                    @error="(e) => (e.target.src = '/images/no_image_available.jpg')" />
                </div>
              </td>

              <!-- 操作 -->
              <td class="px-4 py-2 text-center whitespace-nowrap">
                <button type="button"
                  class="rounded bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-rose-700 cursor-pointer"
                  @click="deleteCartItem(item.id)">
                  刪除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { debounce } from 'lodash-es'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import Swal from "sweetalert2";

const cartStore = useCartStore()
const router = useRouter()
const apiBase = import.meta.env.VITE_API_BASE_URL;
const localQuantities = reactive({})

const groupedCartItems = computed(() => {
  const groups = {} // 無法改變物件位置但可以修改內部屬性或陣列

  cartStore.cartItems.forEach((item) => {
    const vendorId = item.product?.vendor?.id || 'unknown'
    const shopName = item.product?.vendor?.shopName || '其他商家'

    if (!groups[vendorId]) {
      groups[vendorId] = {
        vendorId,
        shopName,
        items: []
      }
    }
    groups[vendorId].items.push(item)
  })

  return Object.values(groups)
})

const getQuantity = (item) => {
  return localQuantities[item.id] ?? item.quantity
}

const getSubtotal = (item) => {
  const qty = getQuantity(item)
  return item.product?.price ? item.product.price * qty : item.subtotal
}

const debouncedUpdateQuantity = debounce(async (id, newQuantity) => {
  try {
    await cartStore.updateQuantity(id, newQuantity)
  } catch (error) {
    // 如果 API 失敗，將本地的 localQuantities 恢復成 Pinia 裡的舊數量
    const item = cartStore.cartItems.find((i) => String(i.id) === String(id))
    if (item) {
      localQuantities[id] = item.quantity
    }
    console.error('更新數量失敗，已還原原數量', error)
  }
}, 500)

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
    await cartStore.removeItem(id)

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
  if (cartStore.selectedItemIds.length === 0) {
    Swal.fire({
      title: "結帳項目未選取",
      icon: "warning",
      timer: 1500,
      showConfirmButton: false,
    });

    return
  }

  router.push("/order/add")
}

onMounted(async () => {
  // 確保載入頁面時，購物車內商品正確
  await cartStore.fetchCart()
})
</script>

<style scoped></style>
