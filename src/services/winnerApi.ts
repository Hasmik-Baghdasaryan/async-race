import { WINNERS_PER_PAGE } from '@/constants/constants';
import type {
  FetchWinnersParams,
  FetchWinnersResponse,
  UpdateWinnerParams,
  Winner,
} from '@/features/winners/types';
import { transformApiError } from '@/helpers/errorTransformer';
import { fetchData, fetchWithHeaders } from '@/helpers/httpClient';
import { validatePagination } from '@/helpers/utility';

export function getAllWinnersApi({
  page,
  limit,
  sort,
  order,
  signal,
}: FetchWinnersParams): Promise<FetchWinnersResponse> {
  validatePagination(page, limit);

  const params = new URLSearchParams({
    _page: String(page || 1),
    _limit: String(limit || WINNERS_PER_PAGE),
    _sort: String(sort || 'id'),
    _order: String(order || 'ASC'),
  });

  return fetchWithHeaders<Winner[]>({
    endpoint: `winners?${params.toString()}`,
    signal,
  })
    .then(({ data, headers }) => ({
      winners: data,
      totalCount: Number(headers.get('X-Total-Count')),
    }))
    .catch((error) => {
      const transformed = transformApiError(error);
      throw new Error(transformed.message);
    });
}

export function createWinnerApi(
  body: Winner,
  signal?: AbortSignal
): Promise<Winner> {
  return fetchData<Winner>({
    endpoint: 'winners',
    method: 'POST',
    body,
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}

export function updateWinnerApi(
  id: number,
  body: UpdateWinnerParams,
  signal?: AbortSignal
): Promise<Winner> {
  return fetchData<Winner>({
    endpoint: `winners/${id}`,
    method: 'PUT',
    body,
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}

export function getWinnerApi(
  id: number,
  signal?: AbortSignal
): Promise<Winner> {
  return fetchData<Winner>({
    endpoint: `winners/${id}`,
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}

export function deleteWinnerApi(
  id: number,
  signal?: AbortSignal
): Promise<unknown> {
  return fetchData<void>({
    endpoint: `winners/${id}`,
    method: 'DELETE',
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}
