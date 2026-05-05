import { ref } from "vue";

export function useFeedback() {
  const message = ref("");
  const error = ref("");

  function clearFeedback() {
    message.value = "";
    error.value = "";
  }

  function setSuccessFeedback(value: string) {
    message.value = value;
    error.value = "";
  }

  function setErrorFeedback(value: string) {
    error.value = value;
    message.value = "";
  }

  return {
    message,
    error,
    clearFeedback,
    setSuccessFeedback,
    setErrorFeedback,
  };
}