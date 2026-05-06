<script setup lang="ts">
import type { FeedXweet } from "../../services/feed";

const props = defineProps<{
  xweet: FeedXweet;
  replyContent: string;
  isLiking: boolean;
  isUnliking: boolean;
  isReplying: boolean;
}>();

function handleToggleLike() {
  if (props.xweet.likedByMe) {
    emit("unlike", props.xweet.id);
    return;
  }

  emit("like", props.xweet.id);
}

function getLikeButtonLabel() {
  if (props.isLiking) {
    return "Liking...";
  }

  if (props.isUnliking) {
    return "Removing...";
  }

  return props.xweet.likedByMe ? "❤️ Liked" : "♡ Like";
}

const emit = defineEmits<{
  (event: "like", xweetId: string): void;
  (event: "unlike", xweetId: string): void;
  (event: "reply", xweetId: string): void;
  (event: "open-thread", xweetId: string): void;
  (
    event: "update-reply-content",
    payload: { xweetId: string; content: string }
  ): void;
}>();

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getInputValue(event: Event) {
  const target = event.target as HTMLInputElement | null;
  return target?.value ?? "";
}
</script>

<template>
  <li class="xweet-card">
    <article>
      <header class="xweet-header">
        <div class="xweet-author-info">
          <img
            v-if="xweet.author.profileImage"
            :src="xweet.author.profileImage"
            :alt="`${xweet.author.name} profile image`"
            class="xweet-avatar"
          />

          <div v-else class="xweet-avatar xweet-avatar-fallback">
            {{ getInitials(xweet.author.name) }}
          </div>

          <div>
            <strong class="xweet-author-name">
              {{ xweet.author.name }}
            </strong>

            <p class="xweet-date">
              {{ formatDate(xweet.createdAt) }}
            </p>
          </div>
        </div>

        <span class="xweet-badge">Xweet</span>
      </header>

      <p class="xweet-content">
        {{ xweet.content }}
      </p>

      <footer class="xweet-actions">
        <button
          type="button"
          class="icon-button"
          :disabled="isLiking || isUnliking"
          @click="handleToggleLike"
        >
          {{ getLikeButtonLabel() }}
        </button>
        <button
          type="button"
          class="icon-button"
          @click="emit('open-thread', xweet.id)"
        >
          💬 {{ xweet.repliesCount }}
          {{ xweet.repliesCount === 1 ? "reply" : "replies" }}
        </button>
      </footer>

      <form class="reply-form" @submit.prevent="emit('reply', xweet.id)">
        <input
          :value="replyContent"
          class="field"
          type="text"
          placeholder="Write a thoughtful reply..."
          @input="
            emit('update-reply-content', {
              xweetId: xweet.id,
              content: getInputValue($event),
            })
          "
        />

        <button
          type="submit"
          class="button button-primary"
          :disabled="isReplying"
        >
          {{ isReplying ? "Replying..." : "Reply" }}
        </button>
      </form>
    </article>
  </li>
</template>