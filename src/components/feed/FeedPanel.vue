<script setup lang="ts">
import XweetCard from "./XweetCard.vue";
import EmptyState from "../ui/EmptyState.vue";
import type { FeedXweet } from "../../services/feed";

defineProps<{
  feed: FeedXweet[];
  loadingFeed: boolean;
  replyContentByXweetId: Record<string, string>;
  activeLikeXweetId: string | null;
  activeUnlikeXweetId: string | null;
  activeReplyXweetId: string | null;
}>();

const emit = defineEmits<{
  (event: "refresh"): void;
  (event: "like", xweetId: string): void;
  (event: "unlike", xweetId: string): void;
  (event: "reply", xweetId: string): void;
  (event: "open-thread", xweetId: string): void;
  (
    event: "update-reply-content",
    payload: { xweetId: string; content: string }
  ): void;
}>();
</script>

<template>
  <section class="card feed-panel">
    <div class="feed-heading">
      <div>
        <p class="section-kicker">Feed</p>
        <h2>Your personalized feed</h2>
        <p class="feed-description">
          See your own xweets and posts from users you follow.
        </p>
      </div>

      <button
        type="button"
        class="button button-secondary"
        :disabled="loadingFeed"
        @click="emit('refresh')"
      >
        {{ loadingFeed ? "Refreshing..." : "Refresh feed" }}
      </button>
    </div>

    <EmptyState
      v-if="loadingFeed"
      icon="⏳"
      title="Loading feed"
      description="Please wait while we fetch your latest xweets."
    />

    <EmptyState
      v-else-if="feed.length === 0"
      icon="🌈"
      title="Your feed is waiting"
      description="Create a xweet or follow another user to start seeing posts here."
    />

    <ul v-else class="feed-list">
      <XweetCard
        v-for="xweet in feed"
        :key="xweet.id"
        :xweet="xweet"
        :reply-content="replyContentByXweetId[xweet.id] ?? ''"
        :is-liking="activeLikeXweetId === xweet.id"
        :is-unliking="activeUnlikeXweetId === xweet.id"
        :is-replying="activeReplyXweetId === xweet.id"
        @like="emit('like', $event)"
        @unlike="emit('unlike', $event)"
        @reply="emit('reply', $event)"
        @open-thread="emit('open-thread', $event)"
        @update-reply-content="emit('update-reply-content', $event)"
      />
    </ul>
  </section>
</template>