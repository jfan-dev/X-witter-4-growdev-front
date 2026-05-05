<script setup lang="ts">
defineProps<{
  modelValue: string;
  loading: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "submit"): void;
}>();

function getTextareaValue(event: Event) {
  const target = event.target as HTMLTextAreaElement | null;
  return target?.value ?? "";
}
</script>

<template>
  <section class="card">
    <div>
      <p class="section-kicker">Create</p>
      <h2>Create xweet</h2>
    </div>

    <form class="form-grid" @submit.prevent="emit('submit')">
      <textarea
        :value="modelValue"
        class="textarea"
        placeholder="What is happening?"
        @input="emit('update:modelValue', getTextareaValue($event))"
      />

      <button
        type="submit"
        class="button button-primary"
        :disabled="loading"
      >
        {{ loading ? "Posting..." : "Post xweet" }}
      </button>
    </form>
  </section>
</template>