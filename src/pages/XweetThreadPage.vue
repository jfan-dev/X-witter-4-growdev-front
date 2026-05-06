<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import FeedbackMessage from "../components/FeedbackMessage.vue";
import XweetCard from "../components/feed/XweetCard.vue";
import EmptyState from "../components/ui/EmptyState.vue";

import {
  getXweetThread,
  type XweetThread,
} from "../services/xweets";

import { useFeedback } from "../composables/useFeedback";
import { useXweetActions } from "../composables/useXweetActions";
import { useXweetState } from "../composables/useXweetState";
import { getErrorMessage } from "../utils/getErrorMessage";

const route = useRoute();
const router = useRouter();

const thread = ref<XweetThread | null>(null);
const loadingThread = ref(false);

const {
  message,
  error,
  clearFeedback,
  setSuccessFeedback,
  setErrorFeedback,
} = useFeedback();

const {
  replyContentByXweetId,
  activeLikeXweetId,
  activeUnlikeXweetId,
  activeReplyXweetId,
} = useXweetState();

const {
  likeExistingXweet,
  unlikeExistingXweet,
  replyToExistingXweet,
} = useXweetActions();

const xweetId = computed(() => {
  const routeId = route.params.id;

  return Array.isArray(routeId) ? routeId[0] : routeId;
});

async function loadThread(id: string) {
  clearFeedback();
  loadingThread.value = true;

  try {
    thread.value = await getXweetThread(id);
  } catch (err) {
    setErrorFeedback(getErrorMessage(err, "Failed to load xweet thread."));
  } finally {
    loadingThread.value = false;
  }
}

async function handleLikeXweet(targetXweetId: string) {
  clearFeedback();
  activeLikeXweetId.value = targetXweetId;

  try {
    const result = await likeExistingXweet(targetXweetId);

    setSuccessFeedback(result.message);

    if (xweetId.value) {
      await loadThread(xweetId.value);
    }
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    activeLikeXweetId.value = null;
  }
}

async function handleUnlikeXweet(targetXweetId: string) {
  clearFeedback();
  activeUnlikeXweetId.value = targetXweetId;

  try {
    const result = await unlikeExistingXweet(targetXweetId);

    setSuccessFeedback(result.message);

    if (xweetId.value) {
      await loadThread(xweetId.value);
    }
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    activeUnlikeXweetId.value = null;
  }
}

async function handleReplyToXweet(targetXweetId: string) {
  clearFeedback();
  activeReplyXweetId.value = targetXweetId;

  try {
    const content = replyContentByXweetId.value[targetXweetId];

    await replyToExistingXweet(targetXweetId, content);

    replyContentByXweetId.value[targetXweetId] = "";

    setSuccessFeedback("Reply created successfully");

    if (xweetId.value) {
      await loadThread(xweetId.value);
    }
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    activeReplyXweetId.value = null;
  }
}

function handleOpenThread(targetXweetId: string) {
  router.push(`/app/xweets/${targetXweetId}`);
}

watch(
  xweetId,
  async (id) => {
    if (!id) {
      setErrorFeedback("Xweet id is required.");
      return;
    }

    await loadThread(id);
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <FeedbackMessage
    v-if="message"
    type="success"
    :message="message"
  />

  <FeedbackMessage
    v-if="error"
    type="error"
    :message="error"
  />

  <section class="card feed-panel">
    <div class="feed-heading">
      <div>
        <p class="section-kicker">Thread</p>
        <h2>Xweet thread</h2>
        <p class="feed-description">
          Read the original xweet and its replies.
        </p>
      </div>

      <button
        type="button"
        class="button button-secondary"
        @click="router.push('/app')"
      >
        Back to feed
      </button>
    </div>

    <EmptyState
      v-if="loadingThread"
      icon="⏳"
      title="Loading thread"
      description="Please wait while we fetch this xweet and its replies."
    />

    <EmptyState
      v-else-if="!thread"
      icon="💬"
      title="Thread not found"
      description="We could not load this xweet thread."
    />

    <template v-else>
      <ul class="feed-list">
        <XweetCard
          :xweet="thread"
          :reply-content="replyContentByXweetId[thread.id] ?? ''"
          :is-liking="activeLikeXweetId === thread.id"
          :is-unliking="activeUnlikeXweetId === thread.id"
          :is-replying="activeReplyXweetId === thread.id"
          @like="handleLikeXweet"
          @unlike="handleUnlikeXweet"
          @reply="handleReplyToXweet"
          @open-thread="handleOpenThread"
          @update-reply-content="
            replyContentByXweetId[$event.xweetId] = $event.content
          "
        />
      </ul>

      <div class="feed-heading">
        <div>
          <p class="section-kicker">Replies</p>
          <h2>
            {{ thread.repliesCount }}
            {{ thread.repliesCount === 1 ? "reply" : "replies" }}
          </h2>
        </div>
      </div>

      <EmptyState
        v-if="thread.replies.length === 0"
        icon="🌱"
        title="No replies yet"
        description="Be the first to reply to this xweet."
      />

      <ul
        v-else
        class="feed-list"
      >
        <XweetCard
          v-for="reply in thread.replies"
          :key="reply.id"
          :xweet="reply"
          :reply-content="replyContentByXweetId[reply.id] ?? ''"
          :is-liking="activeLikeXweetId === reply.id"
          :is-unliking="activeUnlikeXweetId === reply.id"
          :is-replying="activeReplyXweetId === reply.id"
          @like="handleLikeXweet"
          @unlike="handleUnlikeXweet"
          @reply="handleReplyToXweet"
          @open-thread="handleOpenThread"
          @update-reply-content="
            replyContentByXweetId[$event.xweetId] = $event.content
          "
        />
      </ul>
    </template>
  </section>
</template>