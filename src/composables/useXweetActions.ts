import {
  createXweet,
  likeXweet,
  unlikeXweet,
  replyToXweet,
} from "../services/xweets";

export function useXweetActions() {
  async function createNewXweet(content: string) {
    await createXweet({ content });
  }

  async function likeExistingXweet(xweetId: string) {
    return await likeXweet(xweetId);
  }

  async function unlikeExistingXweet(xweetId: string) {
    return await unlikeXweet(xweetId);
  }

  async function replyToExistingXweet(xweetId: string, content: string) {
    await replyToXweet(xweetId, { content });
  }

  return {
    createNewXweet,
    likeExistingXweet,
    unlikeExistingXweet,
    replyToExistingXweet,
  };
}