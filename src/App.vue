<script setup lang="ts">
  import { ref } from "vue";
  import { signin, signup } from "./services/auth";
  import { getFeed, type FeedXweet } from "./services/feed";
  import { createXweet, likeXweet, unlikeXweet, replyToXweet } from "./services/xweets";
  import { getUserProfile, followUser, unfollowUser, type UserProfile } from "./services/users";

  const apiUrl = import.meta.env.VITE_API_URL;

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

  const loadingSignup = ref(false);
  const loadingSignin = ref(false);
  const loadingCreateXweet = ref(false);
  const loadingProfile = ref(false);
  const loadingFollow = ref(false);
  const loadingUnfollow = ref(false);

  const activeLikeXweetId = ref<string | null>(null);
  const activeUnlikeXweetId = ref<string | null>(null);
  const activeReplyXweetId = ref<string | null>(null);

  const isAuthenticated = ref(Boolean(localStorage.getItem("token")));

  type AuthView = "signin" | "signup";
  const authView = ref<AuthView>("signin");

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

  async function handleSignup() {
    clearFeedback();
    loadingSignup.value = true;

    try {
      error.value = "";
      message.value = "";

      await signup({
        name: signupName.value,
        email: signupEmail.value,
        password: signupPassword.value,
        birthdate: signupBirthdate.value,
      });

      const createdEmail = signupEmail.value;

      signupName.value = "";
      signupEmail.value = "";
      signupPassword.value = "";
      signupBirthdate.value = "";

      email.value = createdEmail;
      password.value = "";
      authView.value = "signin";

      message.value = "Signup successful. You can now sign in.";
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      loadingSignup.value = false;
    }
  }

  async function handleSignin() {
    clearFeedback();
    loadingSignin.value = true;

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
      error.value = getErrorMessage(err);
    } finally {
      loadingSignin.value = false;
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
    clearFeedback();
    loadingCreateXweet.value = true;

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
      error.value = getErrorMessage(err);
    } finally {
      loadingCreateXweet.value = false;
    }
  }

  async function handleLikeXweet(xweetId: string) {
    clearFeedback();
    activeLikeXweetId.value = xweetId;
  
    try {
        error.value = "";
        message.value = "";

        const result = await likeXweet(xweetId);

        message.value = result.message;

        await loadFeed();
      } catch (err) {
        error.value = getErrorMessage(err);
      } finally {
        activeLikeXweetId.value = null;
    }
  }

  async function handleUnlikeXweet(xweetId: string) {
    clearFeedback();
    activeUnlikeXweetId.value = xweetId;
    
    try {
      error.value = "";
      message.value = "";

      const result = await unlikeXweet(xweetId);

      message.value = result.message;

      await loadFeed();
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      activeUnlikeXweetId.value = null;
    }
  }

  async function handleReplyToXweet(xweetId: string) {
    clearFeedback();
    activeReplyXweetId.value = xweetId;
    
    try {
      error.value = "";
      message.value = "";

      const content = replyContentByXweetId.value[xweetId];

      await replyToXweet(xweetId, { content });

      replyContentByXweetId.value[xweetId] = "";
      message.value = "Reply created successfully";

      await loadFeed();
    } catch (err) {
      error.value = getErrorMessage(err);
    } finally {
      activeReplyXweetId.value = null;
    }
  }

  function clearFeedback() {
    message.value = "";
    error.value = "";
  }

  function getErrorMessage(err: unknown, fallback = "Something went wrong") {
    if (err instanceof Error) {
      return err.message;
    }

    return fallback;
  }
</script>

<template>
  <main class="app-shell">
    <header class="app-header">
      <div>
        <p class="brand-kicker">X-uitter MVP</p>
        <h1>X-uitter</h1>
        <p class="app-subtitle">
          A playful Twitter-like proof of concept connected to your real REST API.
        </p>
      </div>

      <aside class="status-panel">
        <div class="status-row">
          <span>Status</span>
          <strong class="badge">
            {{ isAuthenticated ? "Authenticated" : "Guest" }}
          </strong>
        </div>

        <div class="status-row">
          <span>API</span>
          <code class="api-url">{{ apiUrl }}</code>
        </div>

        <button
          v-if="isAuthenticated"
          type="button"
          class="button button-danger"
          @click="handleLogout"
        >
          Logout
        </button>
      </aside>
    </header>

    <p v-if="message" class="feedback feedback-success">
      {{ message }}
    </p>

    <p v-if="error" class="feedback feedback-error">
      {{ error }}
    </p>

    <div class="layout-grid">
      <aside class="stack">
        <section v-if="!isAuthenticated" class="card auth-card">
          <div class="auth-header">
            <div>
              <p class="section-kicker">Access</p>
              <h2>
                {{ authView === "signin" ? "Welcome back" : "Create your account" }}
              </h2>
            </div>

            <div class="auth-tabs" aria-label="Authentication options">
              <button
                type="button"
                class="auth-tab"
                :class="{ 'auth-tab-active': authView === 'signin' }"
                @click="authView = 'signin'"
              >
                Sign in
              </button>

              <button
                type="button"
                class="auth-tab"
                :class="{ 'auth-tab-active': authView === 'signup' }"
                @click="authView = 'signup'"
              >
                Sign up
              </button>
            </div>
          </div>

          <form
            v-if="authView === 'signin'"
            class="form-grid"
            @submit.prevent="handleSignin"
          >
            <input
              v-model="email"
              class="field"
              type="email"
              placeholder="Email"
            />

            <input
              v-model="password"
              class="field"
              type="password"
              placeholder="Password"
            />

            <button
              type="submit"
              class="button button-primary"
              :disabled="loadingSignin"
            >
              {{ loadingSignin ? "Signing in..." : "Sign in" }}
            </button>
          </form>

          <form
            v-else
            class="form-grid"
            @submit.prevent="handleSignup"
          >
            <input
              v-model="signupName"
              class="field"
              type="text"
              placeholder="Name"
            />

            <input
              v-model="signupEmail"
              class="field"
              type="email"
              placeholder="Email"
            />

            <input
              v-model="signupPassword"
              class="field"
              type="password"
              placeholder="Password"
            />

            <input
              v-model="signupBirthdate"
              class="field"
              type="date"
            />

            <button
              type="submit"
              class="button button-primary"
              :disabled="loadingSignup"
            >
              {{ loadingSignup ? "Creating account..." : "Create account" }}
            </button>
          </form>

          <p class="auth-helper">
            {{
              authView === "signin"
                ? "Sign in to unlock your feed, likes, replies, follows, and profile actions."
                : "After signup, you will be moved back to the signin form."
            }}
          </p>
        </section>

        <section v-else class="card profile-card">
          <div>
            <p class="section-kicker">Profile</p>
            <h2>User profile</h2>
          </div>

          <form class="form-grid" @submit.prevent="handleLoadProfile">
            <input
              v-model="profileUserId"
              class="field"
              type="text"
              placeholder="Paste a user ID"
            />

            <button
              type="submit"
              class="button button-secondary"
              :disabled="loadingProfile"
            >
              {{ loadingProfile ? "Loading profile..." : "Load profile" }}
            </button>
          </form>

          <article v-if="profile" class="profile-card">
            <div class="profile-header">
              <img
                :src="profile.profileImage"
                alt="Profile image"
                class="avatar"
              />

              <div>
                <h3>{{ profile.name }}</h3>
                <p>{{ profile.email }}</p>
              </div>
            </div>

            <div class="metrics">
              <div class="metric">
                <strong>{{ profile.xweets.length }}</strong>
                <span>Xweets</span>
              </div>

              <div class="metric">
                <strong>{{ profile.followers.length }}</strong>
                <span>Followers</span>
              </div>

              <div class="metric">
                <strong>{{ profile.following.length }}</strong>
                <span>Following</span>
              </div>
            </div>

            <div class="button-row">
              <button
                type="button"
                class="button button-primary"
                :disabled="loadingFollow"
                @click="handleFollowUser"
              >
                {{ loadingFollow ? "Following..." : "Follow" }}
              </button>

              <button
                type="button"
                class="button button-secondary"
                :disabled="loadingUnfollow"
                @click="handleUnfollowUser"
              >
                {{ loadingUnfollow ? "Unfollowing..." : "Unfollow" }}
              </button>
            </div>
          </article>

          <p v-else class="empty-state">
            Load a user profile to see their xweets, followers, and following users.
          </p>
        </section>
      </aside>

      <section class="stack">
        <section v-if="isAuthenticated" class="card">
          <div>
            <p class="section-kicker">Create</p>
            <h2>Create xweet</h2>
          </div>

          <form class="form-grid" @submit.prevent="handleCreateXweet">
            <textarea
              v-model="newXweetContent"
              class="textarea"
              placeholder="What is happening?"
            />

            <button
              type="submit"
              class="button button-primary"
              :disabled="loadingCreateXweet"
            >
              {{ loadingCreateXweet ? "Posting..." : "Post xweet" }}
            </button>
          </form>
        </section>

        <section v-else class="card welcome-card">
          <p class="section-kicker">Welcome</p>
          <h2>Build, post, follow, and interact</h2>

          <p class="welcome-text">
            X-uitter is a polished front-end proof of concept connected to your deployed
            REST API. Sign in to test the full social flow.
          </p>

          <div class="feature-grid">
            <div class="feature-chip">
              <span>🔐</span>
              <strong>JWT Auth</strong>
            </div>

            <div class="feature-chip">
              <span>🐦</span>
              <strong>Xweets</strong>
            </div>

            <div class="feature-chip">
              <span>❤️</span>
              <strong>Likes</strong>
            </div>

            <div class="feature-chip">
              <span>🤝</span>
              <strong>Follows</strong>
            </div>
          </div>
        </section>

        <section class="card feed-panel">
          <div class="feed-heading">
            <div>
              <p class="section-kicker">Timeline</p>
              <h2>Your feed</h2>
              <p class="feed-description">
                See your own xweets and posts from people you follow.
              </p>
            </div>

            <button
              type="button"
              class="button button-secondary"
              :disabled="loadingFeed || !isAuthenticated"
              @click="loadFeed"
            >
              {{ loadingFeed ? "Refreshing..." : "Refresh feed" }}
            </button>
          </div>

          <article v-if="!isAuthenticated" class="empty-state empty-state-card">
            <span class="empty-icon">✨</span>
            <h3>Your timeline is waiting</h3>
            <p>
              Sign in to load your personalized feed with your own xweets and posts from
              users you follow.
            </p>
          </article>

          <article v-else-if="loadingFeed" class="empty-state empty-state-card">
            <span class="empty-icon">⏳</span>
            <h3>Loading your timeline</h3>
            <p>
              Fetching the latest xweets from your account and followed users.
            </p>
          </article>

          <article v-else-if="feed.length === 0" class="empty-state empty-state-card">
            <span class="empty-icon">🌈</span>
            <h3>No xweets yet</h3>
            <p>
              Create your first xweet or follow another user to make your feed come alive.
            </p>
          </article>

          <ul v-else class="feed-list">
            <li
              v-for="xweet in feed"
              :key="xweet.id"
              class="xweet-card"
            >
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
                    :disabled="activeLikeXweetId === xweet.id"
                    @click="handleLikeXweet(xweet.id)"
                  >
                    {{ activeLikeXweetId === xweet.id ? "Liking..." : "❤️ Like" }}
                  </button>

                  <button
                    type="button"
                    class="icon-button"
                    :disabled="activeUnlikeXweetId === xweet.id"
                    @click="handleUnlikeXweet(xweet.id)"
                  >
                    {{
                      activeUnlikeXweetId === xweet.id
                        ? "Removing..."
                        : "♡ Unlike"
                    }}
                  </button>
                </footer>

                <form
                  class="reply-form"
                  @submit.prevent="handleReplyToXweet(xweet.id)"
                >
                  <input
                    v-model="replyContentByXweetId[xweet.id]"
                    class="field"
                    type="text"
                    placeholder="Write a thoughtful reply..."
                  />

                  <button
                    type="submit"
                    class="button button-primary"
                    :disabled="activeReplyXweetId === xweet.id"
                  >
                    {{
                      activeReplyXweetId === xweet.id
                        ? "Replying..."
                        : "Reply"
                    }}
                  </button>
                </form>
              </article>
            </li>
          </ul>
        </section>
      </section>
    </div>
  </main>
</template>