import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { cartApi } from "@/api/cartApi";

export const useCartStore = defineStore("cart", () => {
  const cartItems = ref([]);

  const savedSelectedIds = JSON.parse(
    sessionStorage.getItem("cart_selected_ids")
  );
  const selectedItemIds = ref(
    Array.isArray(savedSelectedIds) ? savedSelectedIds : []
  );

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

  // 動態計算目前已勾選商品隸屬於哪家 Vendor
  const activeVendorId = computed(() => {
    if (selectedItemIds.value.length === 0) return null;
    const firstSelectedItem = cartItems.value.find((item) =>
      selectedItemIds.value.includes(item.id)
    );
    return firstSelectedItem?.product?.vendor?.id || null;
  });

  // 將 selectedItemIds 存入 sessionStorage
  const saveSelectedIdsToStorage = () => {
    sessionStorage.setItem(
      "cart_selected_ids",
      JSON.stringify(selectedItemIds.value)
    );
  };

  // 取得購物車列表
  const fetchCart = async () => {
    try {
      cartItems.value = await cartApi.getCartItems();

      // 確保 sessionStorage 裡的 selectedItemIds 合法
      const validItemIds = cartItems.value.map((item) => item.id);
      selectedItemIds.value = selectedItemIds.value.filter((id) =>
        validItemIds.includes(id)
      );

      saveSelectedIdsToStorage();
    } catch (error) {
      console.error("取得購物車失敗:", error);
    }
  };

  // 清空購物車列表
  const clearCart = () => {
    cartItems.value = [];
    selectedItemIds.value = [];
    sessionStorage.removeItem("cart_selected_ids");
  };

  // 勾選/取消勾選單一商品
  const toggleSelectItem = (item) => {
    const itemId = item.id;
    const itemVendorId = item.product?.vendor?.id;
    const index = selectedItemIds.value.indexOf(itemId);

    // 情況 A：已經勾選過 -> 點擊則是「取消勾選」
    if (index > -1) {
      selectedItemIds.value.splice(index, 1);
      return;
    }

    // 情況 B：全新勾選 -> 檢查是否與目前已選取的 Vendor 相同
    if (activeVendorId.value && activeVendorId.value !== itemVendorId) {
      // 跨 Vendor：直接清空先前的選擇，只保留當前這筆
      selectedItemIds.value = [itemId];
    } else {
      // 同家 Vendor 或目前尚未選取任何商品 -> 正常加入
      selectedItemIds.value.push(itemId);
    }

    saveSelectedIdsToStorage();
  };

  // 全選/取消全選
  const toggleVendorAll = (groupItems) => {
    const groupItemIds = groupItems.map((item) => item.id);

    // 檢查該商家的商品是否已全選
    const isAllVendorSelected = groupItemIds.every((id) =>
      selectedItemIds.value.includes(id)
    );

    if (isAllVendorSelected) {
      // 若該商家已全選 -> 清空該商家的勾選
      selectedItemIds.value = selectedItemIds.value.filter(
        (id) => !groupItemIds.includes(id)
      );
    } else {
      // 若尚未全選或跨 Vendor -> 直接將選取目標覆蓋為該商家的所有商品
      selectedItemIds.value = [...groupItemIds]; // 拷貝新的陣列
    }

    saveSelectedIdsToStorage();
  };

  // 更新商品數量
  const updateQuantity = async (id, newQuantity) => {
    const item = cartItems.value.find((i) => String(i.id) === String(id));
    if (!item) return;

    const oldQuantity = item.quantity;

    try {
      await cartApi.updateCartItemQuantity(id, newQuantity);
      item.quantity = newQuantity;
    } catch (error) {
      console.error(`[CartStore] 更新商品 ${id} 數量失敗:`, error);
      item.quantity = oldQuantity;
      throw error;
    }
  };

  // 新增購物車商品
  const addItem = async (productId, quantity = 1) => {
    try {
      const resItem = await cartApi.addCartItem(productId, quantity);

      const existingItem = cartItems.value.find(
        (item) => Number(item.product?.id) === Number(productId)
      );

      if (existingItem) {
        existingItem.quantity = resItem.quantity;
      } else {
        cartItems.value.push(resItem);
      }
    } catch (error) {
      console.error(`新增商品 ${productId} 至購物車失敗:`, error);
      throw error;
    }
  };

  // 刪除購物車商品
  const removeItem = async (id) => {
    try {
      await cartApi.deleteCartItem(id);

      cartItems.value = cartItems.value.filter((item) => item.id !== id);
      selectedItemIds.value = selectedItemIds.value.filter(
        (itemId) => itemId !== id
      );

      saveSelectedIdsToStorage();
    } catch (error) {
      console.error(`刪除購物車商品 ${id} 失敗:`, error);
      throw error;
    }
  };

  // 下單成功後，清除購物車中「已購買的商品」與「勾選狀態」
  const clearPurchasedItems = () => {
    cartItems.value = cartItems.value.filter(
      (item) => !selectedItemIds.value.includes(item.id)
    );
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
    activeVendorId,

    // Actions
    fetchCart,
    clearCart,
    toggleSelectItem,
    toggleVendorAll,
    updateQuantity,
    addItem,
    removeItem,
    clearPurchasedItems,
  };
});
