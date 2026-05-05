<script setup lang="ts">
defineProps<{
  modelValue: string;
  loading: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "submit"): void;
}>();

function getInputValue(event: Event) {
  const target = event.target as HTMLInputElement | null;
  return target?.value ?? "";
}
</script>

<template>
  <form class="profile-search" @submit.prevent="emit('submit')">
    <input
      :value="modelValue"
      class="field"
      type="text"
      placeholder="Search by name or email"
      @input="emit('update:modelValue', getInputValue($event))"
    />

    <button
      type="submit"
      class="button button-secondary"
      :disabled="loading"
    >
      {{ loading ? "Searching..." : "Search" }}
    </button>
  </form>
</template>