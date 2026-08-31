import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { cartApi } from "@/api/cartApi";

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref([]);
  const selectedItemIds = ref([]);

  // 購物車總商品數
  const totalCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  // 勾選要結帳的商品物件清單 (過濾出 selectedItemIds 有包含的商品)
  const selectedItems = computed(() => {
    return cartItems.value.filter((item) =>
      selectedItemIds.value.includes(item.id)
    );
  });

  // 勾選商品的總金額 (結帳頁要顯示的商品小計)
  const selectedTotalPrice = computed(() => {
    return selectedItems.value.reduce(
      (sum, item) => sum + item.product?.price * item.quantity,
      0
    );
  });

  // 是否全選 (供購物車頁面的全選 Checkbox 綁定)
  const isAllSelected = computed(() => {
    if (cartItems.value.length === 0) return false; // 防止購物車清單為空但回傳 true
    return cartItems.value.length === selectedItemIds.value.length;
  });

  // 取得購物車列表
  const fetchCart = async () => {
    try {
      cartItems.value = await cartApi.getCartItems();
    } catch (error) {
      console.error("取得購物車失敗:", error);
    }
  };

  // 清空購物車列表
  const clearCart = () => {
    cartItems.value = [];
    selectedItemIds.value = [];
  };

  // 勾選/取消勾選單一商品
  const toggleSelectItem = (id) => {
    const index = selectedItemIds.value.indexOf(id);
    if (index > -1) {
      selectedItemIds.value.splice(index, 1); // 從 index 位置刪除 1 個元素
    } else {
      selectedItemIds.value.push(id);
    }
  };

  // 全選/取消全選
  const toggleSelectAll = () => {
    if (isAllSelected.value) {
      selectedItemIds.value = [];
    } else {
      selectedItemIds.value = cartItems.value.map((item) => item.id);
    }
  };

  // 更新商品數量
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cartItems.value.find((i) => i.id === id);
    if (item) {
      item.quantity = newQuantity;
      // await apiUpdateCartItem(id, newQuantity) // 同步至後端
    }
  };

  // 刪除購物車單一商品
  const removeItem = async (id) => {
    try {
      await cartApi.deleteCartItem(id);

      cartItems.value = cartItems.value.filter((item) => item.id !== id);
      selectedItemIds.value = selectedItemIds.value.filter(
        (itemId) => itemId !== id
      );
    } catch (error) {
      console.error(`刪除購物車商品 ${id} 失敗:`, error);
      throw error;
    }
  };

  // 下單成功後：清除購物車中「已購買的商品」與「勾選狀態」
  const clearPurchasedItems = () => {
    // 留下「未被勾選」的商品
    cartItems.value = cartItems.value.filter(
      (item) => !selectedItemIds.value.includes(item.id)
    );
    // 清空勾選 ID 陣列
    selectedItemIds.value = [];
  };

  return {
    // State
    cartItems,
    selectedItemIds,

    // Getters
    totalCount,
    selectedItems,
    selectedTotalPrice,
    isAllSelected,

    // Actions
    fetchCart,
    clearCart,
    toggleSelectItem,
    toggleSelectAll,
    updateQuantity,
    removeItem,
    clearPurchasedItems,
  };
});
