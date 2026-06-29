export interface TransformedError {
  message: string;
  status?: number;
  code?: string;
}

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input.',
  401: 'Unauthorized. Please log in again.',
  403: 'Forbidden. You do not have permission.',
  404: 'Resource not found.',
  409: 'Conflict. This resource may already exist.',
  429: 'Too many requests. Please try again later.',
  500: 'Server error. Please try again later.',
  502: 'Bad gateway. Please try again later.',
  503: 'Service unavailable. Please try again later.',
};

function getHttpErrorMessage(status: number): string {
  return HTTP_STATUS_MESSAGES[status] || 'An error occurred. Please try again.';
}

export function transformApiError(error: unknown): TransformedError {
  if (error instanceof Error) {
    const httpMatch = error.message.match(
      /^HTTP (\d+): (.+?)(?:\s*-\s*(.+))?$/
    );

    if (httpMatch) {
      const [, status, , detail] = httpMatch;
      const statusNum = Number(status);

      return {
        message: detail || getHttpErrorMessage(statusNum),
        status: statusNum,
        code: `HTTP_${status}`,
      };
    }

    if (error.message.includes('Network error')) {
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    }

    if (error.message.includes('Request cancelled')) {
      return {
        message: 'Request was cancelled',
        code: 'ABORT_ERROR',
      };
    }

    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
}
