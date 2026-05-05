import { ref } from "vue";
import type { UserProfile, UserSearchResult } from "../services/users";

export function useProfileState() {
  const profileSearchQuery = ref("");
  const profile = ref<UserProfile | null>(null);
  const userSearchResults = ref<UserSearchResult[]>([]);

  const loadingProfile = ref(false);
  const loadingFollow = ref(false);
  const loadingUnfollow = ref(false);

  function clearProfileState() {
    profileSearchQuery.value = "";
    profile.value = null;
    userSearchResults.value = [];
    loadingProfile.value = false;
    loadingFollow.value = false;
    loadingUnfollow.value = false;
  }

  function clearSearchResults() {
    userSearchResults.value = [];
  }

  return {
    profileSearchQuery,
    profile,
    userSearchResults,
    loadingProfile,
    loadingFollow,
    loadingUnfollow,
    clearProfileState,
    clearSearchResults,
  };
}