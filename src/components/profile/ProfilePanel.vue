<script setup lang="ts">
import ProfilePanelHeader from "./ProfilePanelHeader.vue";
import ProfileSearchForm from "./ProfileSearchForm.vue";
import UserSearchResults from "./UserSearchResults.vue";
import ProfilePreview from "./ProfilePreview.vue";

type UserSearchResult = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
};

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
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

defineProps<{
  searchQuery: string;
  loadingProfile: boolean;
  searchResults: UserSearchResult[];
  profile: ProfileUser | null;
  loadingFollow: boolean;
  loadingUnfollow: boolean;
}>();

const emit = defineEmits<{
  (event: "update:searchQuery", value: string): void;
  (event: "search"): void;
  (event: "select-user", userId: string): void;
  (event: "follow"): void;
  (event: "unfollow"): void;
}>();
</script>

<template>
  <section class="card profile-panel">
    <ProfilePanelHeader />

    <ProfileSearchForm
      :model-value="searchQuery"
      :loading="loadingProfile"
      @update:model-value="emit('update:searchQuery', $event)"
      @submit="emit('search')"
    />

    <UserSearchResults
      v-if="searchResults.length > 0"
      :users="searchResults"
      @select="emit('select-user', $event)"
    />

    <ProfilePreview
      v-if="profile"
      :profile="profile"
      :loading-follow="loadingFollow"
      :loading-unfollow="loadingUnfollow"
      @follow="emit('follow')"
      @unfollow="emit('unfollow')"
    />
  </section>
</template>