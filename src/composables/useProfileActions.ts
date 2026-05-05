import {
  followUser,
  getUserProfileById,
  searchUsers,
  unfollowUser,
} from "../services/users";

export function useProfileActions() {
  async function searchUsersByQuery(query: string) {
    return await searchUsers(query);
  }

  async function loadUserProfile(userId: string) {
    return await getUserProfileById(userId);
  }

  async function followSelectedUser(userId: string) {
    return await followUser(userId);
  }

  async function unfollowSelectedUser(userId: string) {
    return await unfollowUser(userId);
  }

  return {
    searchUsersByQuery,
    loadUserProfile,
    followSelectedUser,
    unfollowSelectedUser,
  };
}