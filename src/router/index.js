import { createRouter, createWebHistory } from "vue-router";
import Index from "@/views/Index.vue";
import Login from "@/views/member/Login.vue";
import Register from "@/views/member/Register.vue";
import AddProduct from "@/views/product/AddProduct.vue";
import ManageProduct from "@/views/product/ManageProduct.vue";
import ModifyProduct from "@/views/product/ModifyProduct.vue";

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
    },
    {
      path: "/member/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/product/add",
      name: "AddProduct",
      component: AddProduct,
    },
    {
      path: "/product/manage",
      name: "ManageProduct",
      component: ManageProduct,
    },
    {
      path: "/product/modify",
      name: "ModifyProduct",
      component: ModifyProduct,
    },
  ],
});

export default router;
