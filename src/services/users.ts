import { apiRequest } from "./api";
import { getAuthHeaders } from "./api";

const apiUrl = import.meta.env.VITE_API_URL;

export type UserProfileXweet = {
  id: string;
  content: string;
  createdAt: string;
};

export type UserProfileRelation = {
  id: string;
  name: string;
  profileImage: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  createdAt: string;
  xweets: UserProfileXweet[];
  followers: UserProfileRelation[];
  following: UserProfileRelation[];
};

export async function getUserProfile(userId: string) {
  return apiRequest<UserProfile>(`/users/${userId}`);
}

export async function followUser(userId: string) {
  return apiRequest<{ message: string }>(`/users/${userId}/follow`, {
    method: "POST",
  });
}

export async function unfollowUser(userId: string) {
  return apiRequest<{ message: string }>(`/users/${userId}/follow`, {
    method: "DELETE",
  });
}

export type UserSearchResult = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
};

export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  const response = await fetch(
    `${apiUrl}/users/search?query=${encodeURIComponent(query)}`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to search users.");
  }

  return data;
}

export async function getUserProfileById(userId: string): Promise<UserProfile> {
  const response = await fetch(`${apiUrl}/users/${userId}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load profile.");
  }

  return data;
}
