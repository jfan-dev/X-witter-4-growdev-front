<script setup lang="ts">
defineProps<{
  apiUrl?: string;
  isAuthenticated: boolean;
}>();

const emit = defineEmits<{
  (event: "logout"): void;
}>();
</script>

<template>
  <header class="app-header">
    <div>
      <p class="brand-kicker">X-uitter MVP</p>
      <h1>X-uitter</h1>
      <p class="app-subtitle">
        A playful Twitter-like proof of concept connected to your real REST API.
      </p>
    </div>

    <aside class="status-panel">
      <div class="status-row">
        <span>Status</span>
        <strong class="badge">
          {{ isAuthenticated ? "Authenticated" : "Guest" }}
        </strong>
      </div>

      <div class="status-row">
        <span>API</span>
        <code class="api-url">{{ apiUrl }}</code>
      </div>

      <button
        v-if="isAuthenticated"
        type="button"
        class="button button-danger"
        @click="emit('logout')"
      >
        Logout
      </button>
    </aside>
  </header>
</template>