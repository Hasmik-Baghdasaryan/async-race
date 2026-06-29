export function getErrorMessage(err: unknown, message?: string): string {
  if (err instanceof Error) {
    if (err.message.includes('Network error')) {
      return 'Server is unreachable. Please check if the server is running.';
    }
    return message || 'An error occurred';
  }

  if (typeof err === 'object' && err !== null && 'message' in err) {
    const errorMsg = (err as Record<string, unknown>).message as string;
    if (errorMsg.includes('Network error')) {
      return 'Server is unreachable. Please check if the server is running.';
    }
    return message || 'An error occurred';
  }

  return message || 'An error occurred';
}
