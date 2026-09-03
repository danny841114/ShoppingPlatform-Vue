<template>
    <!-- Modal 遮罩層與容器 -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen && order"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            @click.self="handleClose">
            <!-- Modal 主體卡片 -->
            <div class="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl transition-all">
                <!-- 標頭區 -->
                <div class="flex items-center justify-between border-b pb-4">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">訂單詳情 #{{ order.orderNumber }}</h3>
                        <p class="text-xs text-gray-500 mt-1">建立時間：{{ order.createdDate || '近期' }}</p>
                    </div>
                    <button @click="handleClose"
                        class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">
                        ✕
                    </button>
                </div>

                <!-- 內容區（可滾動） -->
                <div class="my-4 max-h-[60vh] overflow-y-auto pr-1">
                    <!-- 賣家資訊 / 狀態 -->
                    <div class="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm">
                        <div>
                            <span class="text-gray-500">賣家：</span>
                            <span class="font-medium text-gray-800">{{ order.vendor?.shopName || '店家' }}</span>
                        </div>
                        <div>
                            <span class="text-gray-500">訂單狀態：</span>
                            <span class="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                {{ order.status || '處理中' }}
                            </span>
                        </div>
                    </div>

                    <!-- 購買人 / 收件資訊 / 付款與備註 -->
                    <div class="space-y-3">
                        <!-- 收件資訊區塊 -->
                        <div class="rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm">
                            <div
                                class="flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                收件資訊
                            </div>
                            <div class="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                                <div>
                                    <span class="text-xs text-gray-400 block">收件人</span>
                                    <span class="font-semibold text-gray-800">{{ order.receiverName }}</span>
                                </div>
                                <div>
                                    <span class="text-xs text-gray-400 block">連絡電話</span>
                                    <span class="font-medium text-gray-800">{{ order.receiverPhone }}</span>
                                </div>
                                <div>
                                    <span class="text-xs text-gray-400 block">Email</span>
                                    <span class="font-medium text-gray-800 truncate block"
                                        :title="order.receiverEmail">{{ order.receiverEmail || '無' }}</span>
                                </div>
                                <div class="sm:col-span-3 mt-1 pt-2 border-t border-dashed border-gray-100">
                                    <span class="text-xs text-gray-400 block">配送地址</span>
                                    <span class="font-medium text-gray-800">{{ order.receiverAddress }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- 付款與備註區塊 -->
                        <div class="rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm">
                            <div
                                class="flex items-center justify-between border-b border-gray-100 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <span class="flex items-center gap-2">
                                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    付款與備註
                                </span>
                                <span class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 font-medium">
                                    {{ order.paymentMethod }}
                                </span>
                            </div>
                            <div class="mt-2 text-xs text-gray-600">
                                <span class="text-gray-400 block mb-1">買家備註：</span>
                                <p
                                    class="rounded-md bg-gray-50 p-2 text-gray-700 leading-relaxed whitespace-pre-line border border-gray-100">
                                    {{ order.note || '無備註資訊' }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- 商品明細列表 -->
                    <table class="w-full text-left text-sm text-gray-600">
                        <thead class="border-b bg-gray-50 text-xs text-gray-700 uppercase">
                            <tr>
                                <th class="py-2.5 px-3">商品名稱</th>
                                <th class="py-2.5 px-3 text-right">單價</th>
                                <th class="py-2.5 px-3 text-center">數量</th>
                                <th class="py-2.5 px-3 text-right">小計</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="item in order.items" :key="item.productId" class="hover:bg-gray-50">
                                <td class="py-3 px-3 font-medium text-gray-800">
                                    {{ item.productName }}
                                </td>
                                <td class="py-3 px-3 text-right">${{ item.price }}</td>
                                <td class="py-3 px-3 text-center">x{{ item.quantity }}</td>
                                <td class="py-3 px-3 text-right font-medium text-gray-800">
                                    ${{ item.price * item.quantity }}
                                </td>
                            </tr>
                            <tr>
                                <td class="py-3 px-3 font-medium text-gray-800">運費</td>
                                <td></td>
                                <td></td>
                                <td class="py-3 px-3 text-right font-medium text-gray-800">$60</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 底部結算區與關閉按鈕 -->
                <div class="flex items-center justify-between border-t pt-4">
                    <div class="text-lg font-bold text-gray-900">
                        總計：<span class="text-red-600">${{ order.totalAmount }}</span>
                    </div>
                    <button @click="handleClose"
                        class="rounded-lg bg-gray-800 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 transition">
                        關閉
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    order: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close'])

// 計算訂單總金額
// const totalPrice = computed(() => {
//     if (!props.order?.orderItems) return 0
//     return props.order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
// })

const handleClose = () => {
    emit('close')
}
</script>
