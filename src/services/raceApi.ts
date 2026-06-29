import type {
  EngineResponse,
  SwitchDriveModeResponse,
} from '@/features/race/types';
import { transformApiError } from '@/helpers/errorTransformer';
import { fetchData } from '@/helpers/httpClient';

export function startEngineApi(carId: number, signal?: AbortSignal) {
  return fetchData<EngineResponse>({
    endpoint: `engine?id=${carId}&status=started`,
    method: 'PATCH',
    body: {},
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}

export function stopEngineApi(carId: number, signal?: AbortSignal) {
  return fetchData<EngineResponse>({
    endpoint: `engine?id=${carId}&status=stopped`,
    method: 'PATCH',
    body: {},
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}

export function driveCarApi(carId: number, signal?: AbortSignal) {
  return fetchData<SwitchDriveModeResponse>({
    endpoint: `engine?id=${carId}&status=drive`,
    method: 'PATCH',
    body: {},
    signal,
  }).catch((error: unknown) => {
    const transformed = transformApiError(error);
    throw new Error(transformed.message);
  });
}
