import { apiRequest } from "./api";

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
