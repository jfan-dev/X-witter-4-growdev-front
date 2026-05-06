import { apiRequest } from "./api";
import type { FeedXweet } from "./feed";
import { getAuthHeaders } from "./api";

const apiUrl = import.meta.env.VITE_API_URL;

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


export type XweetThread = FeedXweet & {
  replies: FeedXweet[];
};

export async function getXweetThread(
  xweetId: string
): Promise<XweetThread> {
  const response = await fetch(`${apiUrl}/xweets/${xweetId}/thread`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load xweet thread.");
  }

  return {
    ...data,
    replies: data.replies.map((reply: FeedXweet) => ({
      ...reply,
      repliesCount: reply.repliesCount ?? 0,
    })),
  };
}