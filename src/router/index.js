import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/Index.vue";
import Login from "@/views/member/Login.vue";
import Register from "@/views/member/Register.vue";
import AddProduct from "@/views/product/AddProduct.vue";
import ManageProduct from "@/views/product/ManageProduct.vue";
import ModifyProduct from "@/views/product/ModifyProduct.vue";
import ManageCart from "@/views/cart/ManageCart.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Index",
      component: Index,
      alias: "/index",
    },
    {
      path: "/member/login",
      name: "Login",
      component: Login,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: "/member/register",
      name: "Register",
      component: Register,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: "/product/add",
      name: "AddProduct",
      component: AddProduct,
      meta: {
        requiresAuth: true,
        requiresRole: "VENDOR",
      },
    },
    {
      path: "/product/manage",
      name: "ManageProduct",
      component: ManageProduct,
      meta: {
        requiresAuth: true,
        requiresRole: "VENDOR",
      },
    },
    {
      path: "/product/modify",
      name: "ModifyProduct",
      component: ModifyProduct,
      meta: {
        requiresAuth: true,
        requiresRole: "VENDOR",
      },
    },
    {
      path: "/cart",
      name: "ManageCart",
      component: ManageCart,
      meta: {
        requiresAuth: true,
        requiresRole: "MEMBER",
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!to.meta.requiresAuth && !to.meta.guestOnly) {
    return next();
  }

  if (!authStore.account) {
    try {
      await authStore.fetchMe();
    } catch (e) {}
  }

  if (to.meta.guestOnly) {
    if (!authStore.account) {
      return next();
    } else {
      alert("Logout first to view this page");
      return next(from);
    }
  }

  if (to.meta.requiresAuth && !authStore.account) {
    alert("Login first to view this page");
    return next("/member/login");
  }

  const requiredRole = to.meta.requiresRole;
  if (requiredRole && requiredRole !== authStore.role) {
    alert("No permission to view this page");
    return next("/index");
  }

  next();
});

export default router;
