<script setup lang="ts">
import MetricCard from "../ui/MetricCard.vue";
import MiniUserList from "./MiniUserList.vue";
import RecentXweets from "./RecentXweets.vue";

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  isFollowing: boolean;
  xweets: {
    id: string;
    content: string;
    createdAt: string;
  }[];
  followers: {
    id: string;
    name: string;
    profileImage: string | null;
  }[];
  following: {
    id: string;
    name: string;
    profileImage: string | null;
  }[];
};

const props = defineProps<{
  profile: ProfileUser;
  loadingFollow: boolean;
  loadingUnfollow: boolean;
}>();

const emit = defineEmits<{
  (event: "follow"): void;
  (event: "unfollow"): void;
}>();

function handleToggleFollow() {
  if (props.profile.isFollowing) {
    emit("unfollow");
    return;
  }

  emit("follow");
}

function getFollowButtonLabel() {
  if (props.loadingFollow) {
    return "Following...";
  }

  if (props.loadingUnfollow) {
    return "Unfollowing...";
  }

  return props.profile.isFollowing ? "✓ Following" : "Follow";
}
</script>

<template>
  <article class="profile-preview">
    <div class="profile-cover">
      <div class="profile-avatar-wrap">
        <img
          v-if="profile.profileImage"
          :src="profile.profileImage"
          :alt="`${profile.name} profile image`"
          class="avatar profile-avatar"
        />
      </div>
    </div>

    <div class="profile-body">
      <div class="profile-title-row">
        <div>
          <h3>{{ profile.name }}</h3>
          <p class="profile-email">{{ profile.email }}</p>
          <p class="profile-id">{{ profile.id }}</p>
        </div>
      </div>

      <div class="metrics profile-metrics">
        <MetricCard :value="profile.xweets.length" label="Xweets" />
        <MetricCard :value="profile.followers.length" label="Followers" />
        <MetricCard :value="profile.following.length" label="Following" />
      </div>

      <div class="button-row profile-actions">
        <button
          type="button"
          class="button"
          :class="profile.isFollowing ? 'button-secondary' : 'button-primary'"
          :disabled="loadingFollow || loadingUnfollow"
          @click="handleToggleFollow"
        >
          {{ getFollowButtonLabel() }}
        </button>
      </div>

      <div class="profile-lists">
        <MiniUserList
          title="Followers"
          :users="profile.followers"
          empty-message="No followers yet."
        />

        <MiniUserList
          title="Following"
          :users="profile.following"
          empty-message="Not following anyone yet."
        />
      </div>

      <RecentXweets :xweets="profile.xweets" />
    </div>
  </article>
</template>