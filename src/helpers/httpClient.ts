import { API_BASE_URL } from '@/constants/constants';

interface FetchOptionsBase {
  endpoint: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeout?: number;
  retries?: number;
  body?: unknown;
}

interface FetchOptionsWithoutBody extends FetchOptionsBase {
  method?: 'GET' | 'DELETE';
  body?: never;
}

interface FetchOptionsWithBody extends FetchOptionsBase {
  method: 'POST' | 'PUT' | 'PATCH';
  body: unknown;
}

type FetchOptions = FetchOptionsWithoutBody | FetchOptionsWithBody;

interface FetchResponse<T> {
  data: T;
  headers: Headers;
  status: number;
}

async function makeRequest<T>(
  options: FetchOptions
): Promise<FetchResponse<T>> {
  const {
    endpoint,
    method = 'GET',
    body,
    headers = {},
    signal,
    timeout = 30000,
    retries = 3,
  } = options;

  let attempt = 1;

  const executeRequest = async (): Promise<FetchResponse<T>> => {
    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (timeout) {
      timeoutId = setTimeout(() => controller.abort(), timeout);
    }

    let mergedSignal: AbortSignal;
    if (signal) {
      mergedSignal = AbortSignal.any([signal, controller.signal]);
    } else {
      mergedSignal = controller.signal;
    }

    const requestOptions: RequestInit = {
      method,
      signal: mergedSignal,
    };

    if (body !== undefined) {
      requestOptions.headers = {
        'Content-Type': 'application/json',
        ...headers,
      };
      requestOptions.body = JSON.stringify(body);
    } else {
      requestOptions.headers = headers;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`,
        requestOptions
      );

      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json')
        ? ((await response.json()) as T)
        : ((await response.text()) as T);

      if (!response.ok) {
        const errorMessage = (data as Record<string, unknown>)?.message
          ? ` - ${(data as Record<string, unknown>).message}`
          : '';
        throw new Error(`HTTP ${response.status}: ${endpoint}${errorMessage}`);
      }

      return {
        data,
        headers: response.headers,
        status: response.status,
      };
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes('Failed to fetch') &&
        attempt < retries
      ) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return executeRequest();
      }

      if (
        error instanceof TypeError &&
        error.message.includes('Failed to fetch')
      ) {
        throw new Error(`Network error: ${endpoint}`, { cause: error });
      }

      throw error;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  return executeRequest();
}

export async function fetchData<T>(
  options: FetchOptionsWithoutBody
): Promise<T>;
export async function fetchData<T>(options: FetchOptionsWithBody): Promise<T>;
export async function fetchData<T>(options: FetchOptions): Promise<T> {
  const response = await makeRequest<T>(options);
  return response.data;
}

export async function fetchWithHeaders<T>(
  options: FetchOptionsWithoutBody
): Promise<{ data: T; headers: Headers }>;
export async function fetchWithHeaders<T>(
  options: FetchOptionsWithBody
): Promise<{ data: T; headers: Headers }>;
export async function fetchWithHeaders<T>(options: FetchOptions): Promise<{
  data: T;
  headers: Headers;
}> {
  const response = await makeRequest<T>(options);
  return { data: response.data, headers: response.headers };
}
