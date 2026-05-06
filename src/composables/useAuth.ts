import { ref } from "vue";
import type { LoggedUser } from "../services/auth";

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";

const isAuthenticated = ref(Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)));
const currentUser = ref<LoggedUser | null>(loadStoredUser());

function loadStoredUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as LoggedUser;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function useAuth() {
  function saveSession(token: string, user: LoggedUser) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    isAuthenticated.value = true;
    currentUser.value = user;
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    isAuthenticated.value = false;
    currentUser.value = null;
  }

  return {
    isAuthenticated,
    currentUser,
    saveSession,
    clearSession,
  };
}