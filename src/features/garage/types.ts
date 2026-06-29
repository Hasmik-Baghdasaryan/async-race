export interface Car {
  name: string;
  color: string;
  id: number;
}

export interface FetchCarsResponse {
  cars: Car[];
  totalCount: number;
}

export type CarCreateParams = Omit<Car, 'id'>;
export type CarUpdateParams = Omit<Car, 'id'>;
