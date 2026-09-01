<template>
    <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

            <div class="md:col-span-2 bg-white p-6 rounded-xl shadow-sm space-y-6">
                <h2 class="text-xl font-bold text-gray-800 border-b pb-3">訂購人資訊</h2>

                <form @submit.prevent="submitOrder" class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                            <input v-model="form.name" type="text" required
                                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">聯絡電話 *</label>
                            <input v-model="form.phone" type="tel" required
                                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">電子郵件 *</label>
                        <input v-model="form.email" type="email" required
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">寄送地址 *</label>
                        <input v-model="form.address" type="text" required
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">付款方式</label>
                        <select v-model="form.paymentMethod"
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                            <option value="credit_card">信用卡付款</option>
                            <option value="bank_transfer">銀行轉帳</option>
                            <option value="cod">貨到付款</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">訂單備註</label>
                        <textarea v-model="form.note" rows="3" placeholder="如有特殊需求請在此註明..."
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
                    </div>

                    <button type="submit"
                        class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        確認送出訂單
                    </button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm h-fit space-y-4">
                <h3 class="text-lg font-bold text-gray-800 border-b pb-3">訂單明細</h3>

                <div class="space-y-3">
                    <div v-for="item in cartStore.selectedItems" :key="item.id"
                        class="flex justify-between items-center text-sm">
                        <div>
                            <p class="font-medium text-gray-800">{{ item.product?.name }}</p>
                            <p class="text-gray-500">數量：{{ item.quantity }}</p>
                        </div>
                        <span class="font-semibold text-gray-700">NT$ {{ item.product?.price * item.quantity }}</span>
                    </div>
                </div>

                <hr />

                <div class="space-y-2 text-sm">
                    <div class="flex justify-between text-gray-600">
                        <span>小計</span>
                        <span>NT$ {{ cartStore.selectedTotalPrice }}</span>
                    </div>
                    <div class="flex justify-between text-gray-600">
                        <span>運費</span>
                        <span>{{ shippingFee }}</span>
                    </div>
                    <div class="flex justify-between text-base font-bold text-gray-900 border-t pt-2">
                        <span>總金額</span>
                        <span class="text-blue-600">NT$ {{ total }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { orderApi } from '@/api/orderApi'
import Swal from "sweetalert2";

const router = useRouter()
const cartStore = useCartStore()
const form = reactive({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'credit_card',
    note: ''
})
const shippingFee = 60
const total = computed(() => cartStore.selectedTotalPrice + shippingFee)

const submitOrder = async () => {
    try {
        const ask = await Swal.fire({
            title: "送出訂單",
            icon: "question",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: "確認",
            cancelButtonText: "返回",
        });

        if (!ask.isConfirmed) return;

        await orderApi.addOrder(
            cartStore.selectedItemIds,
            form.name,
            form.phone,
            form.email,
            form.address,
            form.paymentMethod,
            form.note,
            shippingFee
        )

        cartStore.clearPurchasedItems()

        router.push("/cart")
    } catch (error) {
        console.error("訂單送出失敗", error)
        Swal.fire({
            title: "訂單送出失敗",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
        });
    }
}
</script>