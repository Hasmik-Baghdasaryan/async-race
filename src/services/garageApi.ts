import { fetchData, fetchWithHeaders } from '@/helpers/httpClient';
import { transformApiError } from '@/helpers/errorTransformer';
import type {
  Car,
  CarCreateParams,
  CarUpdateParams,
  FetchCarsResponse,
} from '@/features/garage/types';
import { CARS_PER_PAGE } from '@/constants/constants';
import { validatePagination } from '@/helpers/utility';

export function getAllCarsApi(
  page: number,
  limit: number,
  signal?: AbortSignal
): Promise<FetchCarsResponse> {
  validatePagination(page, limit);

  const params = new URLSearchParams({
    _page: String(page || 1),
    _limit: String(limit || CARS_PER_PAGE),
  });

  return fetchWithHeaders<Car[]>({
    endpoint: `garage?${params.toString()}`,
    signal,
  })
    .then(({ data, headers }) => ({
      cars: data,
      totalCount: Number(headers.get('X-Total-Count')),
    }))
    .catch((error) => {
      const transformed = transformApiError(error);
      throw new Error(transformed.message);
    });
}

export function createCarApi(
  body: CarCreateParams,
  signal?: AbortSignal
): Promise<Car> {
  return fetchData<Car>({
    endpoint: 'garage',
    method: 'POST',
    body,
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}

export function getCarApi(id: number, signal?: AbortSignal): Promise<Car> {
  return fetchData<Car>({
    endpoint: `garage/${id}`,
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}

export function updateCarApi(
  id: number,
  body: CarUpdateParams,
  signal?: AbortSignal
): Promise<Car> {
  return fetchData<Car>({
    endpoint: `garage/${id}`,
    method: 'PUT',
    body,
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}

export function deleteCarApi(
  id: number,
  signal?: AbortSignal
): Promise<unknown> {
  return fetchData<void>({
    endpoint: `garage/${id}`,
    method: 'DELETE',
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}
