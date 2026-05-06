<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";

import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import { useAuth } from "./composables/useAuth";
import { appLinks } from "./config/appLinks";

const router = useRouter();

const {
  isAuthenticated,
  clearSession,
} = useAuth();

function handleLogout() {
  clearSession();
  router.push("/auth");
}
</script>

<template>
  <div class="app-shell">
    <AppHeader
      :api-url="appLinks.apiUrl"
      :is-authenticated="isAuthenticated"
      @logout="handleLogout"
    />

    <RouterView />

    <AppFooter
      :github-url="appLinks.githubUrl"
      :backend-docs-url="appLinks.backendDocsUrl"
      :backend-health-url="appLinks.backendHealthUrl"
    />
  </div>
</template>