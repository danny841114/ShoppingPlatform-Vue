<template>
    <div class="py-8">
        <!-- 上半部：商品圖與主要資訊 -->
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <!-- 左側：商品圖片展示區 -->
            <div class="space-y-4">
                <div
                    class="aspect-square overflow-hidden rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <img v-if='product && product.id' :src="`${apiBase}/api/product/${product.id}/photo`"
                        :alt="product.name" class="object-cover object-center" />
                </div>
            </div>

            <!-- 右側：商品細節與操作 -->
            <div class="flex flex-col justify-between">
                <div class="space-y-4">
                    <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>

                    <!-- 價格與評價 -->
                    <div class="flex items-center space-x-4">
                        <span class="text-3xl font-bold text-blue-600">NT$ {{ product.price?.toLocaleString() }}</span>
                    </div>

                    <p class="text-sm leading-relaxed text-gray-600">
                        {{ product.description }}
                    </p>

                    <hr class="border-gray-200" />

                    <!-- 數量選擇 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">數量</label>
                        <div class="flex items-center space-x-3">
                            <div class="flex items-center rounded-md border border-gray-300">
                                <button @click="quantity > 1 && quantity--"
                                    class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    :disabled="quantity <= 1">-</button>
                                <span class="w-12 text-center text-sm font-medium">{{ quantity }}</span>
                                <button @click="quantity++" class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    :disabled="quantity >= product.quantity">+</button>
                            </div>
                            <span class="text-xs text-gray-500">庫存僅剩 {{ product.quantity }} 件</span>
                        </div>
                    </div>
                </div>

                <!-- 按鈕區 -->
                <div class="mt-8 flex space-x-4">
                    <button @click="addToCart"
                        class="flex-1 rounded-md border border-blue-600 bg-white py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        加入購物車
                    </button>
                </div>
            </div>
        </div>

        <!-- 下半部：商品詳細介紹 / 規格 Tabs -->
        <div class="mt-16">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8">
                    <button class="border-b-2 py-4 text-sm font-medium transition-colors border-blue-600 text-blue-600">
                        商品詳情
                    </button>
                </nav>
            </div>

            <!-- Tab 內容區 -->
            <div class="py-6">
                <div v-if="activeTab === 'details'" class="prose max-w-none text-gray-600 space-y-4">
                    <p>{{ product.description }}</p>
                </div>

                <!-- <div v-if="activeTab === 'specs'" class="max-w-xl">
                    <dl class="divide-y divide-gray-200 text-sm">
                        <div v-for="(val, key) in product.specs" :key="key" class="grid grid-cols-3 py-3">
                            <dt class="font-medium text-gray-500">{{ key }}</dt>
                            <dd class="col-span-2 text-gray-900">{{ val }}</dd>
                        </div>
                    </dl>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from "vue-router";
import { productApi } from '@/api/productApi'
import Swal from "sweetalert2";

const props = defineProps({
    productId: Number,
})
const apiBase = import.meta.env.VITE_API_BASE_URL;
const product = ref({})
const router = useRouter();
const quantity = ref(1)
const activeTab = ref('details')

const getProduct = async () => {
    try {
        product.value = await productApi.getProductById(props.productId)
    } catch (error) {
        console.log('讀取產品資訊失敗', error)

        Swal.fire({
            title: "無法獲取商品",
            icon: "error",
            timer: 1500,
            showConfirmButton: false,
        });
        router.push("/")
    }
}

onMounted(() => {
    getProduct()
})
</script>

<style scoped></style>