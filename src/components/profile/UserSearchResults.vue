<script setup lang="ts">
type UserSearchResult = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
};

defineProps<{
  users: UserSearchResult[];
}>();

const emit = defineEmits<{
  (event: "select", userId: string): void;
}>();
</script>

<template>
  <section class="mini-list">
    <h4>Search results</h4>

    <ul>
      <li
        v-for="user in users"
        :key="user.id"
      >
        <img
          v-if="user.profileImage"
          :src="user.profileImage"
          :alt="`${user.name} profile image`"
        />

        <button
          type="button"
          class="icon-button"
          @click="emit('select', user.id)"
        >
          {{ user.name }} — {{ user.email }}
        </button>
      </li>
    </ul>
  </section>
</template>