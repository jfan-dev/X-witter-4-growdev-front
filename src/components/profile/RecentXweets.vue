<script setup lang="ts">
type RecentXweet = {
  id: string;
  content: string;
  createdAt: string;
};

defineProps<{
  xweets: RecentXweet[];
}>();

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
</script>

<template>
  <section class="recent-xweets">
    <h4>Recent Xweets</h4>

    <p v-if="xweets.length === 0" class="mini-empty">
      No xweets yet.
    </p>

    <ul v-else>
      <li v-for="xweet in xweets" :key="xweet.id">
        <p>{{ xweet.content }}</p>
        <small>{{ formatDate(xweet.createdAt) }}</small>
      </li>
    </ul>
  </section>
</template>