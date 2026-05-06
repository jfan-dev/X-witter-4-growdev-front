<script setup lang="ts">
import type { LoggedUser } from "../../services/auth";

defineProps<{
  user: LoggedUser;
}>();

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
</script>

<template>
  <section class="card mini-logged-profile">
    <p class="section-kicker">Logged account</p>

    <div class="mini-logged-profile-body">
      <img
        v-if="user.profileImage"
        :src="user.profileImage"
        :alt="`${user.name} profile image`"
        class="avatar mini-logged-avatar"
      />

      <div
        v-else
        class="avatar mini-logged-avatar xweet-avatar-fallback"
      >
        {{ getInitials(user.name) }}
      </div>

      <div>
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
      </div>
    </div>
  </section>
</template>