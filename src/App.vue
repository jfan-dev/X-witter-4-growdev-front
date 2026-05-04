<script setup lang="ts">
import { ref } from "vue";
import { signin, signup } from "./services/auth";
import { getFeed, type FeedXweet } from "./services/feed";
import { createXweet, likeXweet, unlikeXweet, replyToXweet } from "./services/xweets";
import { getUserProfile, followUser, unfollowUser, type UserProfile } from "./services/users";

const email = ref("");
const password = ref("");
const message = ref("");
const error = ref("");
const feed = ref<FeedXweet[]>([]);
const loadingFeed = ref(false);
const newXweetContent = ref("");
const replyContentByXweetId = ref<Record<string, string>>({});
const profileUserId = ref("");
const profile = ref<UserProfile | null>(null);
const signupName = ref("");
const signupEmail = ref("");
const signupPassword = ref("");
const signupBirthdate = ref("");
const isAuthenticated = ref(Boolean(localStorage.getItem("token")));
const apiUrl = import.meta.env.VITE_API_URL;

async function handleSignup() {
  try {
    error.value = "";
    message.value = "";

    await signup({
      name: signupName.value,
      email: signupEmail.value,
      password: signupPassword.value,
      birthdate: signupBirthdate.value,
    });

    signupName.value = "";
    signupEmail.value = "";
    signupPassword.value = "";
    signupBirthdate.value = "";

    message.value = "Signup successful. You can now sign in.";
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Signup failed";
  }
}

function handleLogout() {
  localStorage.removeItem("token");
  isAuthenticated.value = false;

  feed.value = [];
  profile.value = null;
  profileUserId.value = "";
  message.value = "Logged out successfully";
  error.value = "";
}

async function handleFollowUser() {
  try {
    error.value = "";
    message.value = "";

    const result = await followUser(profileUserId.value);

    message.value = result.message;
    await handleLoadProfile();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to follow user";
  }
}

async function handleUnfollowUser() {
  try {
    error.value = "";
    message.value = "";

    const result = await unfollowUser(profileUserId.value);

    message.value = result.message;
    await handleLoadProfile();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to unfollow user";
  }
}

async function handleLoadProfile() {
  try {
    error.value = "";
    message.value = "";

    profile.value = await getUserProfile(profileUserId.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load profile";
  }
}

async function handleSignin() {
  try {
    error.value = "";
    message.value = "";

    const result = await signin({
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", result.token);
    isAuthenticated.value = true;
    message.value = "Signed in successfully";
    await loadFeed();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Signin failed";
  }
}

async function loadFeed() {
  try {
    error.value = "";
    loadingFeed.value = true;

    feed.value = await getFeed();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load feed";
  } finally {
    loadingFeed.value = false;
  }
}

async function handleCreateXweet() {
  try {
    error.value = "";
    message.value = "";

    await createXweet({
      content: newXweetContent.value,
    });

    newXweetContent.value = "";
    message.value = "Xweet created successfully";

    await loadFeed();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to create xweet";
  }
}

async function handleLikeXweet(xweetId: string) {
  try {
    error.value = "";
    message.value = "";

    const result = await likeXweet(xweetId);

    message.value = result.message;

    await loadFeed();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to like xweet";
  }
}

async function handleUnlikeXweet(xweetId: string) {
  try {
    error.value = "";
    message.value = "";

    const result = await unlikeXweet(xweetId);

    message.value = result.message;

    await loadFeed();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to unlike xweet";
  }
}

async function handleReplyToXweet(xweetId: string) {
  try {
    error.value = "";
    message.value = "";

    const content = replyContentByXweetId.value[xweetId];

    await replyToXweet(xweetId, { content });

    replyContentByXweetId.value[xweetId] = "";
    message.value = "Reply created successfully";

    await loadFeed();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to reply";
  }
}
</script>

<template>
  <main>
  <button type="button" @click="handleLogout">
    Logout
  </button>
    <h1>X-uitter Front POC</h1>
    <p>
      Status:
      <strong>{{ isAuthenticated ? "Authenticated" : "Guest" }}</strong>
    </p>
    <p>
      API:
      <code>{{ apiUrl }}</code>
    </p>
    <form @submit.prevent="handleSignup">
      <h2>Signup</h2>

      <input v-model="signupName" type="text" placeholder="Name" />

      <input v-model="signupEmail" type="email" placeholder="Email" />

      <input v-model="signupPassword" type="password" placeholder="Password" />

      <input v-model="signupBirthdate" type="date" />

      <button type="submit">Signup</button>
    </form>

    <form @submit.prevent="handleSignin">
      <h2>Signin</h2>

      <input v-model="email" type="email" placeholder="Email" />

      <input v-model="password" type="password" placeholder="Password" />

      <button type="submit">Signin</button>
    </form>

    <section>
      <h2>Create Xweet</h2>

      <form @submit.prevent="handleCreateXweet">
        <textarea
          v-model="newXweetContent"
          placeholder="What is happening?"
        ></textarea>

        <button type="submit">Post</button>
      </form>
    </section>

    <section>
      <h2>User Profile</h2>

      <form @submit.prevent="handleLoadProfile">
        <input
          v-model="profileUserId"
          type="text"
          placeholder="User ID"
        />

        <button type="submit">Load profile</button>
      </form>

      <article v-if="profile">
      <button type="button" @click="handleFollowUser">
        Follow
      </button>

      <button type="button" @click="handleUnfollowUser">
        Unfollow
      </button>
        <h3>{{ profile.name }}</h3>
        <p>{{ profile.email }}</p>
        <img :src="profile.profileImage" alt="Profile image" width="80" />

        <p>Xweets: {{ profile.xweets.length }}</p>
        <p>Followers: {{ profile.followers.length }}</p>
        <p>Following: {{ profile.following.length }}</p>
      </article>
    </section>

    <section>
      <h2>Feed</h2>

      <button type="button" @click="loadFeed">
        Load feed
      </button>

      <p v-if="loadingFeed">Loading feed...</p>

      <ul>
        <li v-for="xweet in feed" :key="xweet.id">
          <strong>{{ xweet.author.name }}</strong>
          <p>{{ xweet.content }}</p>
          <small>{{ xweet.createdAt }}</small>
          <br />
          <button type="button" @click="handleLikeXweet(xweet.id)">
            Like
          </button>
          <button type="button" @click="handleUnlikeXweet(xweet.id)">
            Unlike
          </button>
          <form @submit.prevent="handleReplyToXweet(xweet.id)">
            <input
              v-model="replyContentByXweetId[xweet.id]"
              type="text"
              placeholder="Write a reply"
            />

            <button type="submit">Reply</button>
          </form>
        </li>
      </ul>
    </section>

    <p v-if="message">{{ message }}</p>
    <p v-if="error">{{ error }}</p>
  </main>
</template>

<style scoped>
:global(body) {
  margin: 0;
  min-height: 100vh;

  background:
    linear-gradient(rgba(0, 0, 0, 0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.018) 1px, transparent 1px),
    radial-gradient(ellipse at 0% 12%, #cfefff 0%, transparent 57%),
    radial-gradient(ellipse at 50% 55%, #fff2cc 0%, transparent 99%),
    radial-gradient(ellipse at 75% 95%, #ffe1f0 0%, transparent 86%),
    linear-gradient(
      10deg,
      #eef8ff 0%,
      #fff9e9 50%,
      #ffffff 100%
    );

  background-size:
    35px 35px,
    35px 35px,
    auto,
    auto,
    auto,
    auto;

  background-attachment: fixed;
}

main {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
  font-family: Arial, sans-serif;
}

section,
form,
article,
li {
  margin-bottom: 24px;
}

input,
textarea,
button {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 8px;
}

button {
  cursor: pointer;
}

ul {
  padding-left: 0;
}

li {
  list-style: none;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
}
</style>