<script setup lang="ts">
import { onMounted } from "vue";

import { useAuthActions } from "./composables/useAuthActions";
import { useFeed } from "./composables/useFeed";
import { useXweetActions } from "./composables/useXweetActions";
import { useProfileActions } from "./composables/useProfileActions";

import { useFeedback } from "./composables/useFeedback";
import { getErrorMessage } from "./utils/getErrorMessage";

import AppHeader from "./components/AppHeader.vue";
import FeedbackMessage from "./components/FeedbackMessage.vue";
import AppFooter from "./components/AppFooter.vue";
import WelcomeCard from "./components/WelcomeCard.vue";
import AuthCard from "./components/auth/AuthCard.vue";
import XweetComposer from "./components/feed/XweetComposer.vue";
import FeedPanel from "./components/feed/FeedPanel.vue";
import ProfilePanel from "./components/profile/ProfilePanel.vue";
import AppMainGrid from "./components/layout/AppMainGrid.vue";
import { useAuth } from "./composables/useAuth";
import { useXweetState } from "./composables/useXweetState";
import { useProfileState } from "./composables/useProfileState";
import { useAuthForm } from "./composables/useAuthForm";
import { appLinks } from "./config/appLinks";

const {
  message,
  error,
  clearFeedback,
  setSuccessFeedback,
  setErrorFeedback,
} = useFeedback();

const {
  isAuthenticated,
  saveSession,
  clearSession: clearAuthSession,
} = useAuth();

const {
  feed,
  loadingFeed,
  loadFeed,
  clearFeed,
} = useFeed();

const {
  newXweetContent,
  loadingCreateXweet,
  replyContentByXweetId,
  activeLikeXweetId,
  activeUnlikeXweetId,
  activeReplyXweetId,
  clearXweetState,
} = useXweetState();

const {
  profileSearchQuery,
  profile,
  userSearchResults,
  loadingProfile,
  loadingFollow,
  loadingUnfollow,
  clearProfileState,
  clearSearchResults,
} = useProfileState();

const {
  authView,
  email,
  password,
  signupName,
  signupEmail,
  signupPassword,
  signupBirthdate,
  loadingSignup,
  loadingSignin,
  prepareSigninAfterSignup,
} = useAuthForm();

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

const {
  createAccount,
  signInWithEmail,
} = useAuthActions();

async function handleSignup() {
  clearFeedback();
  loadingSignup.value = true;

  try {
    await createAccount({
      name: signupName.value,
      email: signupEmail.value,
      password: signupPassword.value,
      birthdate: signupBirthdate.value,
    });

    const createdEmail = signupEmail.value;

    prepareSigninAfterSignup(createdEmail);

    setSuccessFeedback("Signup successful. You can now sign in.");
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    loadingSignup.value = false;
  }
}

async function handleSignin() {
  clearFeedback();
  loadingSignin.value = true;

  try {
    const result = await signInWithEmail({
      email: email.value,
      password: password.value,
    });

    saveSession(result.token);

    setSuccessFeedback("Signed in successfully");

    await loadFeed();
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    loadingSignin.value = false;
  }
}

function handleLogout() {
  clearAuthSession();

  clearFeed();
 
  clearProfileState();

  clearXweetState();

  setSuccessFeedback("Logged out successfully");
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
  if (!isAuthenticated.value) {
    return;
  }

  try {
    await loadFeed();
  } catch (err) {
    setErrorFeedback(getErrorMessage(err, "Failed to load feed"));
  }
});
</script>

<template>
  <div class="app-shell">
    <AppHeader
      :api-url="appLinks.apiUrl"
      :is-authenticated="isAuthenticated"
      @logout="handleLogout"
    />

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
        <AuthCard
          v-if="!isAuthenticated"
          v-model:auth-view="authView"
          v-model:email="email"
          v-model:password="password"
          v-model:signup-name="signupName"
          v-model:signup-email="signupEmail"
          v-model:signup-password="signupPassword"
          v-model:signup-birthdate="signupBirthdate"
          :loading-signin="loadingSignin"
          :loading-signup="loadingSignup"
          @signin="handleSignin"
          @signup="handleSignup"
        />

        <ProfilePanel
          v-else
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

        <XweetComposer
          v-if="isAuthenticated"
          v-model="newXweetContent"
          :loading="loadingCreateXweet"
          @submit="handleCreateXweet"
        />

        <WelcomeCard v-else />
      </template>

      <template #content>
        <FeedPanel
          :feed="feed"
          :loading-feed="loadingFeed"
          :reply-content-by-xweet-id="replyContentByXweetId"
          :active-like-xweet-id="activeLikeXweetId"
          :active-unlike-xweet-id="activeUnlikeXweetId"
          :active-reply-xweet-id="activeReplyXweetId"
          @refresh="loadFeed"
          @like="handleLikeXweet"
          @unlike="handleUnlikeXweet"
          @reply="handleReplyToXweet"
          @update-reply-content="
            replyContentByXweetId[$event.xweetId] = $event.content
          "
        />
      </template>
    </AppMainGrid>

    <AppFooter
      :github-url="appLinks.githubUrl"
      :backend-docs-url="appLinks.backendDocsUrl"
      :backend-health-url="appLinks.backendHealthUrl"
    />
  </div>
</template>