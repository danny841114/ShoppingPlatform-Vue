<template>
    <div class="order-container">
        <h3 class="text-2xl font-bold text-gray-800">我的訂單</h3>

        <!-- 篩選列 -->
        <div class="filter-bar">
            <label>訂單狀態：</label>
            <select v-model="selectedStatus">
                <option value="ALL">全部狀態</option>
                <option value="PENDING">待付款</option>
                <option value="PAID">已付款</option>
                <option value="SHIPPED">已出貨</option>
                <option value="COMPLETED">已完成</option>
                <option value="CANCELLED">已取消</option>
            </select>
        </div>

        <!-- 訂單表格 -->
        <table class="order-table">
            <thead>
                <tr>
                    <th>訂單編號</th>
                    <th>建立時間</th>
                    <th>總金額</th>
                    <th>狀態</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                    <td>{{ order.orderNumber }}</td>
                    <td>{{ order.createdDate }}</td>
                    <td>NT$ {{ order.totalAmount.toLocaleString() }}</td>
                    <td>
                        <span :class="['status-badge', statusMap[order.status]?.class]">
                            {{ statusMap[order.status]?.label }}
                        </span>
                    </td>
                    <td>
                        <button class="btn-detail" @click="openDetail(order)">查看細節</button>
                    </td>
                </tr>
                <tr v-if="filteredOrders.length === 0">
                    <td colspan="6" class="no-data">查無符合條件的訂單</td>
                </tr>
            </tbody>
        </table>

        <!-- 訂單詳情 Modal 元件 -->
        <OrderDetailModal :is-open="isModalOpen" :order="selectedOrder" @close="closeModal" />
    </div>
</template>

<script setup>
import OrderDetailModal from '@/components/OrderDetailModal.vue'
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { orderApi } from '@/api/orderApi'

const authStore = useAuthStore()
const orders = ref([])
const selectedStatus = ref('ALL')
const isModalOpen = ref(false)
const selectedOrder = ref(null)

const getOrders = async () => {
    try {
        orders.value = await orderApi.getOrders(authStore.memberId, null)
    } catch (error) {
        console.error("獲取訂單清單失敗", error)
    }
}

// 根據選取的狀態進行資料篩選
const filteredOrders = computed(() => {
    if (selectedStatus.value === 'ALL') {
        return orders.value
    }
    return orders.value.filter(order => order.status === selectedStatus.value)
})

// 狀態文字對照表（純 JS 物件）
const statusMap = {
    PENDING: { label: '待付款', class: 'status-pending' },
    PAID: { label: '已付款', class: 'status-paid' },
    SHIPPED: { label: '已出貨', class: 'status-shipped' },
    COMPLETED: { label: '已完成', class: 'status-completed' },
    CANCELLED: { label: '已取消', class: 'status-cancelled' }
}

const openDetail = (order) => {
    selectedOrder.value = order
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    selectedOrder.value = null
}

// 組件掛載時抓取資料
onMounted(getOrders)
</script>

<style scoped>
.order-container {
    padding: 24px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-bar {
    margin-bottom: 20px;
}

.filter-bar select {
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

.order-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

.order-table th,
.order-table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
}

.order-table th {
    background-color: #f8f9fa;
    color: #333;
}

/* 狀態標籤樣式 */
.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: bold;
}

.status-pending {
    background-color: #fff3cd;
    color: #856404;
}

.status-paid {
    background-color: #d1ecf1;
    color: #0c5460;
}

.status-shipped {
    background-color: #d4edda;
    color: #155724;
}

.status-completed {
    background-color: #e2e3e5;
    color: #383d41;
}

.status-cancelled {
    background-color: #f8d7da;
    color: #721c24;
}

.btn-detail {
    padding: 4px 10px;
    border: none;
    background-color: #409eff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
}

.btn-detail:hover {
    background-color: #66b1ff;
}

.loading,
.no-data {
    text-align: center;
    padding: 40px;
    color: #888;
}
</style>