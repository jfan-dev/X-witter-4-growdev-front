<script setup lang="ts">
import { ref } from "vue";
import { signin } from "./services/auth";
import { getFeed, type FeedXweet } from "./services/feed";
import { createXweet } from "./services/xweets";

const email = ref("");
const password = ref("");
const message = ref("");
const error = ref("");
const feed = ref<FeedXweet[]>([]);
const loadingFeed = ref(false);
const newXweetContent = ref("");

async function handleSignin() {
  try {
    error.value = "";
    message.value = "";

    const result = await signin({
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", result.token);
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
</script>

<template>
  <main>
    <h1>X-uitter Front POC</h1>

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
        </li>
      </ul>
    </section>

    <p v-if="message">{{ message }}</p>
    <p v-if="error">{{ error }}</p>
  </main>
</template>