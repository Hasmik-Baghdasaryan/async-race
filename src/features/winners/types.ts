export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface FetchWinnersResponse {
  winners: Winner[];
  totalCount: number;
}

export interface FetchWinnersParams {
  page?: number;
  limit?: number;
  sort?: SortTypes;
  order?: OrderTypes;
  signal?: AbortSignal;
}

export type SortTypes = 'id' | 'wins' | 'time';
export type OrderTypes = 'ASC' | 'DESC';
export type UpdateWinnerParams = Omit<Winner, 'id'>;
