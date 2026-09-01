<template>
    <div class="order-container">
        <h2>📦 訂單管理列表 (JS 版)</h2>

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

        <!-- 載入中提示 -->
        <div v-if="isLoading" class="loading">
            資料載入中...
        </div>

        <!-- 訂單表格 -->
        <table v-else class="order-table">
            <thead>
                <tr>
                    <th>訂單編號</th>
                    <th>建立時間</th>
                    <th>收件人</th>
                    <th>總金額</th>
                    <th>狀態</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                    <td>{{ order.orderNumber }}</td>
                    <td>{{ order.createdAt }}</td>
                    <td>{{ order.receiverName }}</td>
                    <td>NT$ {{ order.totalAmount.toLocaleString() }}</td>
                    <td>
                        <span :class="['status-badge', statusMap[order.status]?.class]">
                            {{ statusMap[order.status]?.label }}
                        </span>
                    </td>
                    <td>
                        <button class="btn-detail">查看細節</button>
                    </td>
                </tr>
                <tr v-if="filteredOrders.length === 0">
                    <td colspan="6" class="no-data">查無符合條件的訂單</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// ----------------------------------------------------
// 狀態定義
// ----------------------------------------------------

// 訂單列表資料（純 JS 陣列）
const orders = ref([])

// 載入狀態與篩選條件
const isLoading = ref(false)
const selectedStatus = ref('ALL')

// ----------------------------------------------------
// 假資料與 API 模擬
// ----------------------------------------------------
const fetchOrders = async () => {
    isLoading.value = true

    // 模擬 API 延遲與回傳資料
    setTimeout(() => {
        orders.value = [
            {
                id: 'ord-001',
                orderNumber: '20260901001',
                createdAt: '2026-09-01 10:30',
                receiverName: '張小明',
                totalAmount: 1280,
                status: 'PAID'
            },
            {
                id: 'ord-002',
                orderNumber: '20260901002',
                createdAt: '2026-09-01 11:15',
                receiverName: '李美玲',
                totalAmount: 3450,
                status: 'SHIPPED'
            },
            {
                id: 'ord-003',
                orderNumber: '20260831005',
                createdAt: '2026-08-31 18:20',
                receiverName: '王大衛',
                totalAmount: 600,
                status: 'PENDING'
            }
        ]
        isLoading.value = false
    }, 600)
}

// ----------------------------------------------------
// 計算屬性與方法
// ----------------------------------------------------

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

// 組件掛載時抓取資料
onMounted(() => {
    fetchOrders()
})
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