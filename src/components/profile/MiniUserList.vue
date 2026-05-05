<script setup lang="ts">
type MiniUser = {
  id: string;
  name: string;
  profileImage?: string | null;
};

defineProps<{
  title: string;
  users: MiniUser[];
  emptyMessage: string;
}>();
</script>

<template>
  <section class="mini-list">
    <h4>{{ title }}</h4>

    <p v-if="users.length === 0" class="mini-empty">
      {{ emptyMessage }}
    </p>

    <ul v-else>
      <li v-for="user in users" :key="user.id">
        <img
          v-if="user.profileImage"
          :src="user.profileImage"
          :alt="`${user.name} profile image`"
        />

        <span>{{ user.name }}</span>
      </li>
    </ul>
  </section>
</template>