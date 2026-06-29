import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  type FetchCarsResponse,
  type Car,
  type CarCreateParams,
  type CarUpdateParams,
} from './types';
import {
  getAllCarsApi,
  createCarApi,
  updateCarApi,
  deleteCarApi,
} from '@/services/garageApi';
import {
  createAsyncThunkHelper,
  handleAsyncThunk,
} from '@/helpers/createAsyncThunkHelper';
import { generateCars } from './helpers/helper';
import { CARS_PER_PAGE } from '@/constants/constants';

interface GarageState {
  cars: Car[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string;
  total: number;
  selectedCar: Car | null;
}

const initialState: GarageState = {
  cars: [],
  status: 'idle',
  error: '',
  total: 0,
  selectedCar: null,
};

export const fetchAllCars = createAsyncThunkHelper<
  FetchCarsResponse,
  { page: number; limit: number }
>('garage/fetchAllCars', ({ page = 1, limit = CARS_PER_PAGE }) =>
  getAllCarsApi(page, limit)
);

export const createNewCar = createAsyncThunkHelper<Car, CarCreateParams>(
  'garage/createNewCar',
  (car) => createCarApi(car)
);

export const updateCar = createAsyncThunkHelper<
  Car,
  { id: number; car: CarUpdateParams }
>('garage/updateCar', ({ id, car }) => updateCarApi(id, car));

export const deleteCar = createAsyncThunkHelper<unknown, number>(
  'garage/deleteCar',
  (id) => deleteCarApi(id)
);

export const generateRandomCars = createAsyncThunkHelper<
  FetchCarsResponse,
  number
>('garage/generateRandomCars', async (count) => {
  const cars = Array.from({ length: count }, () => generateCars());

  const results = await Promise.allSettled(
    cars.map((car) => createCarApi(car))
  );

  const failedCount = results.filter((r) => r.status === 'rejected').length;
  const successCount = count - failedCount;

  if (failedCount > 0) {
    console.warn(
      `Generated ${successCount}/${count} cars. ${failedCount} failed to create.`
    );
  }

  return getAllCarsApi(1, CARS_PER_PAGE);
});

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setSelectedCar: (state, action: PayloadAction<Car | null>) => {
      state.selectedCar = action.payload;
    },
    unSelectCar: (state) => {
      state.selectedCar = null;
    },
    clearCars: (state) => {
      state.cars = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    handleAsyncThunk(builder, fetchAllCars, (state, action) => {
      state.cars = action.payload.cars;
      state.total = action.payload.totalCount;
    });

    handleAsyncThunk(builder, createNewCar, (state, action) => {
      state.cars.push(action.payload);
      state.total += 1;
    });

    handleAsyncThunk(builder, updateCar, (state, action) => {
      state.cars = state.cars.map((car) =>
        car.id === action.payload.id ? action.payload : car
      );
    });

    handleAsyncThunk(builder, deleteCar, (state, action) => {
      state.cars = state.cars.filter((car) => car.id !== action.meta.arg);
      state.total -= 1;
    });

    handleAsyncThunk(builder, generateRandomCars, (state, action) => {
      state.cars = action.payload.cars;
      state.total = action.payload.totalCount;
    });
  },
});

export const { setSelectedCar, unSelectCar, clearCars } = garageSlice.actions;
export default garageSlice.reducer;
