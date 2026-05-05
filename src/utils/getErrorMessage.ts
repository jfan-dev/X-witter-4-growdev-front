export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
) {
  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
}