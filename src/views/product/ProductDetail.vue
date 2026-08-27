<template>
    <div class="py-8">
        <!-- 上半部：商品圖與主要資訊 -->
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <!-- 左側：商品圖片展示區 -->
            <div class="space-y-4">
                <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                    <img :src="selectedImage" :alt="product.name" class="h-full w-full object-cover object-center" />
                </div>
                <!-- 縮圖列表 -->
                <div class="grid grid-cols-4 gap-4">
                    <button v-for="(img, index) in product.images" :key="index" @click="selectedImage = img"
                        :class="['aspect-square overflow-hidden rounded-md border-2 transition-all', selectedImage === img ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300']">
                        <img :src="img" class="h-full w-full object-cover object-center" />
                    </button>
                </div>
            </div>

            <!-- 右側：商品細節與操作 -->
            <div class="flex flex-col justify-between">
                <div class="space-y-4">
                    <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        {{ product.category }}
                    </span>
                    <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>

                    <!-- 價格與評價 -->
                    <div class="flex items-center space-x-4">
                        <span class="text-3xl font-bold text-blue-600">NT$ {{ product.price.toLocaleString() }}</span>
                        <span v-if="product.originalPrice" class="text-lg text-gray-400 line-through">
                            NT$ {{ product.originalPrice.toLocaleString() }}
                        </span>
                    </div>

                    <p class="text-sm leading-relaxed text-gray-600">
                        {{ product.description }}
                    </p>

                    <hr class="border-gray-200" />

                    <!-- 規格選擇（例如：顏色/款式） -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">顏色</label>
                        <div class="flex space-x-3">
                            <button v-for="color in product.colors" :key="color.name"
                                @click="selectedColor = color.name"
                                :class="['rounded-md border px-4 py-2 text-sm font-medium transition-colors', selectedColor === color.name ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50']">
                                {{ color.name }}
                            </button>
                        </div>
                    </div>

                    <!-- 數量選擇 -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">數量</label>
                        <div class="flex items-center space-x-3">
                            <div class="flex items-center rounded-md border border-gray-300">
                                <button @click="quantity > 1 && quantity--"
                                    class="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    :disabled="quantity <= 1">-</button>
                                <span class="w-12 text-center text-sm font-medium">{{ quantity }}</span>
                                <button @click="quantity++" class="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
                            </div>
                            <span class="text-xs text-gray-500">庫存僅剩 {{ product.stock }} 件</span>
                        </div>
                    </div>
                </div>

                <!-- 按鈕區 -->
                <div class="mt-8 flex space-x-4">
                    <button @click="addToCart"
                        class="flex-1 rounded-md border border-blue-600 bg-white py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        加入購物車
                    </button>
                    <button @click="buyNow"
                        class="flex-1 rounded-md bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        立即購買
                    </button>
                </div>
            </div>
        </div>

        <!-- 下半部：商品詳細介紹 / 規格 Tabs -->
        <div class="mt-16">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8">
                    <button @click="activeTab = 'details'"
                        :class="['border-b-2 py-4 text-sm font-medium transition-colors', activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']">
                        商品詳情
                    </button>
                    <button @click="activeTab = 'specs'"
                        :class="['border-b-2 py-4 text-sm font-medium transition-colors', activeTab === 'specs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']">
                        規格說明
                    </button>
                </nav>
            </div>

            <!-- Tab 內容區 -->
            <div class="py-6">
                <div v-if="activeTab === 'details'" class="prose max-w-none text-gray-600 space-y-4">
                    <p>這裡可以放置長篇的商品介紹文字、高畫質情境圖片或特色說明。</p>
                    <p>採用符合人體工學的設計，帶給您最舒適的使用體驗。</p>
                </div>

                <div v-if="activeTab === 'specs'" class="max-w-xl">
                    <dl class="divide-y divide-gray-200 text-sm">
                        <div v-for="(val, key) in product.specs" :key="key" class="grid grid-cols-3 py-3">
                            <dt class="font-medium text-gray-500">{{ key }}</dt>
                            <dd class="col-span-2 text-gray-900">{{ val }}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    productId: Number,
})

onMounted(() => { console.log("productId", props.productId) })

// 模擬商品資料
const product = ref({
    name: '無線降噪耳機 Pro',
    category: '視訊 / 音響',
    price: 4990,
    originalPrice: 5990,
    stock: 12,
    description: '頂級主動式降噪技術，搭配高解析度音質單體，為您帶來沉浸式的聆聽體驗。續航力可達 30 小時。',
    images: [
        'https://picsum.photos/600/600?random=1',
        'https://picsum.photos/600/600?random=2',
        'https://picsum.photos/600/600?random=3',
        'https://picsum.photos/600/600?random=4',
    ],
    colors: [
        { name: '經典黑' },
        { name: '太空灰' },
        { name: '珍珠白' }
    ],
    specs: {
        '藍牙版本': 'Bluetooth 5.3',
        '續航時間': '最長 30 小時',
        '充電時間': '約 1.5 小時',
        '重量': '250g',
        '保固': '原廠保固 1 年'
    }
})

// 狀態控制
const selectedImage = ref(product.value.images[0])
const selectedColor = ref(product.value.colors[0].name)
const quantity = ref(1)
const activeTab = ref('details')

// 事件 handler
const addToCart = () => {
    alert(`已將 ${quantity.value} 件【${product.value.name} - ${selectedColor.value}】加入購物車！`)
}

const buyNow = () => {
    alert('直接前往結帳頁面！')
}
</script>
<style scoped></style>