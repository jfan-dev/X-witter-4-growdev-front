<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import AppMainGrid from "../components/layout/AppMainGrid.vue";
import FeedbackMessage from "../components/FeedbackMessage.vue";
import XweetComposer from "../components/feed/XweetComposer.vue";
import FeedPanel from "../components/feed/FeedPanel.vue";
import ProfilePanel from "../components/profile/ProfilePanel.vue";

import { useAuth } from "../composables/useAuth";
import { useFeed } from "../composables/useFeed";
import { useFeedback } from "../composables/useFeedback";
import { useXweetActions } from "../composables/useXweetActions";
import { useXweetState } from "../composables/useXweetState";
import { useProfileActions } from "../composables/useProfileActions";
import { useProfileState } from "../composables/useProfileState";
import MiniLoggedProfile from "../components/profile/MiniLoggedProfile.vue";

import { getErrorMessage } from "../utils/getErrorMessage";

const router = useRouter();

const { currentUser } = useAuth();

function handleOpenThread(xweetId: string) {
  router.push(`/app/xweets/${xweetId}`);
}

const {
  message,
  error,
  clearFeedback,
  setSuccessFeedback,
  setErrorFeedback,
} = useFeedback();

const {
  feed,
  loadingFeed,
  loadFeed,
} = useFeed();

const {
  newXweetContent,
  loadingCreateXweet,
  replyContentByXweetId,
  activeLikeXweetId,
  activeUnlikeXweetId,
  activeReplyXweetId,
} = useXweetState();

const {
  profileSearchQuery,
  profile,
  userSearchResults,
  loadingProfile,
  loadingFollow,
  loadingUnfollow,
  clearSearchResults,
} = useProfileState();

const {
  createNewXweet,
  likeExistingXweet,
  unlikeExistingXweet,
  replyToExistingXweet,
} = useXweetActions();

const {
  searchUsersByQuery,
  loadUserProfile,
  followSelectedUser,
  unfollowSelectedUser,
} = useProfileActions();

async function handleRefreshFeed() {
  clearFeedback();

  try {
    await loadFeed();
  } catch (err) {
    setErrorFeedback(getErrorMessage(err, "Failed to refresh feed."));
  }
}

async function handleCreateXweet() {
  clearFeedback();
  loadingCreateXweet.value = true;

  try {
    await createNewXweet(newXweetContent.value);

    newXweetContent.value = "";

    setSuccessFeedback("Xweet created successfully");

    await loadFeed();
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    loadingCreateXweet.value = false;
  }
}

async function handleLikeXweet(xweetId: string) {
  clearFeedback();
  activeLikeXweetId.value = xweetId;

  try {
    const result = await likeExistingXweet(xweetId);

    setSuccessFeedback(result.message);

    await loadFeed();
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    activeLikeXweetId.value = null;
  }
}

async function handleUnlikeXweet(xweetId: string) {
  clearFeedback();
  activeUnlikeXweetId.value = xweetId;

  try {
    const result = await unlikeExistingXweet(xweetId);

    setSuccessFeedback(result.message);

    await loadFeed();
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    activeUnlikeXweetId.value = null;
  }
}

async function handleReplyToXweet(xweetId: string) {
  clearFeedback();
  activeReplyXweetId.value = xweetId;

  try {
    const content = replyContentByXweetId.value[xweetId];

    await replyToExistingXweet(xweetId, content);

    replyContentByXweetId.value[xweetId] = "";

    setSuccessFeedback("Reply created successfully");

    await loadFeed();
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    activeReplyXweetId.value = null;
  }
}

async function handleSearchUsers() {
  const query = profileSearchQuery.value.trim();

  if (query.length < 2) {
    setErrorFeedback("Search must have at least 2 characters.");
    userSearchResults.value = [];
    return;
  }

  clearFeedback();
  loadingProfile.value = true;

  try {
    userSearchResults.value = await searchUsersByQuery(query);

    if (userSearchResults.value.length === 0) {
      setSuccessFeedback("No users found.");
    }
  } catch (err) {
    setErrorFeedback(getErrorMessage(err, "Failed to search users."));
  } finally {
    loadingProfile.value = false;
  }
}

async function handleSelectUser(userId: string) {
  clearSearchResults();
  profileSearchQuery.value = "";

  await loadProfileById(userId);
}

async function loadProfileById(userId: string) {
  clearFeedback();
  loadingProfile.value = true;

  try {
    profile.value = await loadUserProfile(userId);
  } catch (err) {
    setErrorFeedback(getErrorMessage(err, "Failed to load profile."));
  } finally {
    loadingProfile.value = false;
  }
}

async function handleFollowUser() {
  if (!profile.value) {
    setErrorFeedback("Load a profile before following a user.");
    return;
  }

  clearFeedback();
  loadingFollow.value = true;

  try {
    const selectedUserId = profile.value.id;
    const result = await followSelectedUser(selectedUserId);

    setSuccessFeedback(result.message);

    await loadProfileById(selectedUserId);
    await loadFeed();
  } catch (err) {
    setErrorFeedback(getErrorMessage(err, "Failed to follow user"));
  } finally {
    loadingFollow.value = false;
  }
}

async function handleUnfollowUser() {
  if (!profile.value) {
    setErrorFeedback("Load a profile before unfollowing a user.");
    return;
  }

  clearFeedback();
  loadingUnfollow.value = true;

  try {
    const selectedUserId = profile.value.id;
    const result = await unfollowSelectedUser(selectedUserId);

    setSuccessFeedback(result.message);

    await loadProfileById(selectedUserId);
    await loadFeed();
  } catch (err) {
    setErrorFeedback(getErrorMessage(err, "Failed to unfollow user"));
  } finally {
    loadingUnfollow.value = false;
  }
}

onMounted(async () => {
  try {
    await loadFeed();
  } catch (err) {
    setErrorFeedback(getErrorMessage(err, "Failed to load feed"));
  }
});
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

  <AppMainGrid>
    <template #sidebar>
      <MiniLoggedProfile
        v-if="currentUser"
        :user="currentUser"
      />

      <ProfilePanel
        v-model:search-query="profileSearchQuery"
        :loading-profile="loadingProfile"
        :search-results="userSearchResults"
        :profile="profile"
        :loading-follow="loadingFollow"
        :loading-unfollow="loadingUnfollow"
        @search="handleSearchUsers"
        @select-user="handleSelectUser"
        @follow="handleFollowUser"
        @unfollow="handleUnfollowUser"
      />
    </template>

    <template #content>
      <div class="stack">
        <XweetComposer
          v-model="newXweetContent"
          :loading="loadingCreateXweet"
          @submit="handleCreateXweet"
        />

        <FeedPanel
          :feed="feed"
          :loading-feed="loadingFeed"
          :reply-content-by-xweet-id="replyContentByXweetId"
          :active-like-xweet-id="activeLikeXweetId"
          :active-unlike-xweet-id="activeUnlikeXweetId"
          :active-reply-xweet-id="activeReplyXweetId"
          @refresh="handleRefreshFeed"
          @like="handleLikeXweet"
          @unlike="handleUnlikeXweet"
          @reply="handleReplyToXweet"
          @open-thread="handleOpenThread"
          @update-reply-content="
            replyContentByXweetId[$event.xweetId] = $event.content
          "
        />
      </div>
    </template>
  </AppMainGrid>
</template>