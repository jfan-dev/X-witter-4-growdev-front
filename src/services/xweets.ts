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