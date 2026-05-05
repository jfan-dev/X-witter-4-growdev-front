<script setup lang="ts">
defineProps<{
  message: string;
  type: "success" | "error";
}>();
</script>

<template>
  <p
    class="feedback"
    :class="{
      'feedback-success': type === 'success',
      'feedback-error': type === 'error',
    }"
  >
    {{ message }}
  </p>
</template>