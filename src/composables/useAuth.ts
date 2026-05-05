import { ref } from "vue";

const TOKEN_STORAGE_KEY = "token";

const isAuthenticated = ref(Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)));

export function useAuth() {
  function saveSession(token: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    isAuthenticated.value = true;
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    isAuthenticated.value = false;
  }

  return {
    isAuthenticated,
    saveSession,
    clearSession,
  };
}