import { createRouter, createWebHistory } from "vue-router";

import AuthPage from "../pages/AuthPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import XweetThreadPage from "../pages/XweetThreadPage.vue";

function hasSession() {
  return Boolean(localStorage.getItem("token"));
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: () => {
        return hasSession() ? "/app" : "/auth";
      },
    },
    {
      path: "/auth",
      name: "auth",
      component: AuthPage,
      meta: {
        guestOnly: true,
      },
    },
    {
      path: "/app",
      name: "app",
      component: DashboardPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/app/xweets/:id",
      name: "xweet-thread",
      component: XweetThreadPage,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: () => {
        return hasSession() ? "/app" : "/auth";
      },
    },
  ],
});

router.beforeEach((to) => {
  const authenticated = hasSession();

  if (to.meta.requiresAuth && !authenticated) {
    return "/auth";
  }

  if (to.meta.guestOnly && authenticated) {
    return "/app";
  }

  return true;
});