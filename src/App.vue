<template>
  <div class="container mx-auto px-4">
    <NavBar></NavBar>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import NavBar from "@/components/Navbar.vue";

const authStore = useAuthStore();
const cartStore = useCartStore();

onMounted(async () => {
  await authStore.fetchMe();
  if ("MEMBER" === authStore.role) {
    cartStore.fetchCart();
  }
});
</script>

<style scoped></style>
