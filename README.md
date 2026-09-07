# 🛒 購物平台 - 前端 Client (Vue 3 + Vite)

本專案為電商購物平台的**前端 SPA 用戶端**，採用 Vue 3 + Vite 構建，透過 RESTful API 與 Spring Boot 後端服務進行資料串接。

---

## 🚀 系統功能

- **會員與身份驗證**：註冊、登入/登出、買家 (MEMBER) 與賣家 (VENDOR) 身份切換
- **商品瀏覽**：商品列表、關鍵字搜尋、商品詳情與圖片檢視
- **賣家後台**：商品新增、修改、下架與圖片上傳
- **購物車管理**：加入購物車、修改數量與刪除項目
- **訂單管理**：結帳下單與歷史訂單查詢

---

## 🛠️ 技術選型

- **前端框架**：Vue 3 (Composition API / script setup)
- **建構工具**：Vite
- **路由管理**：Vue Router
- **狀態管理**：Pinia
- **HTTP 客戶端**：Axios (搭配 withCredentials: true 跨域傳送 Cookie)
- **程式碼規範**：ESLint

---

## ⚙️ 開發與建構指令

### 1. 安裝相依套件
npm install

### 2. 啟動本地開發伺服器 (Hot-Reload)
npm run dev
> 開發預設網址：http://localhost:5173
> 後端 API 預設位址：http://localhost:8080

### 3. 編譯與打包 (Production)
npm run build

### 4. 程式碼檢查 (Linting)
npm run lint

---

## 💡 IDE 推薦設定

- **編輯器**：VSCode
- **外掛套件**：Vue - Official
