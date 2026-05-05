import { ref } from "vue";

export function useXweetState() {
  const newXweetContent = ref("");
  const loadingCreateXweet = ref(false);

  const replyContentByXweetId = ref<Record<string, string>>({});

  const activeLikeXweetId = ref<string | null>(null);
  const activeUnlikeXweetId = ref<string | null>(null);
  const activeReplyXweetId = ref<string | null>(null);

  function clearXweetState() {
    newXweetContent.value = "";
    replyContentByXweetId.value = {};
    activeLikeXweetId.value = null;
    activeUnlikeXweetId.value = null;
    activeReplyXweetId.value = null;
  }

  return {
    newXweetContent,
    loadingCreateXweet,
    replyContentByXweetId,
    activeLikeXweetId,
    activeUnlikeXweetId,
    activeReplyXweetId,
    clearXweetState,
  };
}