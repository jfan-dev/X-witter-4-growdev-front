import { createRouter, createWebHistory } from "vue-router";

import AuthPage from "../pages/AuthPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";

function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: () => {
        return isAuthenticated() ? "/app" : "/auth";
      },
    },
    {
      path: "/auth",
      component: AuthPage,
    },
    {
      path: "/app",
      component: DashboardPage,
      beforeEnter: () => {
        if (!isAuthenticated()) {
          return "/auth";
        }

        return true;
      },
    },
  ],
});