import { ref } from "vue";
import { getFeed, type FeedXweet } from "../services/feed";

export function useFeed() {
  const feed = ref<FeedXweet[]>([]);
  const loadingFeed = ref(false);

  async function loadFeed() {
    loadingFeed.value = true;

    try {
      feed.value = await getFeed();
    } finally {
      loadingFeed.value = false;
    }
  }

  function clearFeed() {
    feed.value = [];
  }

  return {
    feed,
    loadingFeed,
    loadFeed,
    clearFeed,
  };
}