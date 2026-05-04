import { apiRequest } from "./api";
import type { FeedXweet } from "./feed";

export type CreateXweetInput = {
  content: string;
};

export async function createXweet(input: CreateXweetInput) {
  return apiRequest<FeedXweet>("/xweets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function likeXweet(xweetId: string) {
  return apiRequest<{ message: string }>(`/xweets/${xweetId}/like`, {
    method: "POST",
  });
}

export async function unlikeXweet(xweetId: string) {
  return apiRequest<{ message: string }>(`/xweets/${xweetId}/like`, {
    method: "DELETE",
  });
}

export type ReplyXweetInput = {
  content: string;
};

export async function replyToXweet(xweetId: string, input: ReplyXweetInput) {
  return apiRequest<FeedXweet>(`/xweets/${xweetId}/reply`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}