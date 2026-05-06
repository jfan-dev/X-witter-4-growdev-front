import { apiRequest } from "./api";

export type FeedAuthor = {
  id: string;
  name: string;
  profileImage: string;
};

export type FeedXweet = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  parentId: string | null;
  likedByMe: boolean;
  repliesCount: number;
  author: {
    id: string;
    name: string;
    profileImage: string | null;
  };
};

export async function getFeed() {
  return apiRequest<FeedXweet[]>("/feed");
}
