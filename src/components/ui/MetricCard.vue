<script setup lang="ts">
defineProps<{
  value: number;
  label: string;
}>();
</script>

<template>
  <div class="metric">
    <strong>{{ value }}</strong>
    <span>{{ label }}</span>
  </div>
</template>