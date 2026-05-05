<script setup lang="ts">
defineProps<{
  icon?: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="empty-state-card">
    <span class="empty-icon">
      {{ icon ?? "✨" }}
    </span>

    <h3>{{ title }}</h3>

    <p>{{ description }}</p>
  </div>
</template>