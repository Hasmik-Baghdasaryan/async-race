import { createAsyncThunkHelper } from '@/helpers/createAsyncThunkHelper';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  EngineResponse,
  EngineStatus,
  SwitchDriveModeResponse,
} from './types';
import { driveCarApi, startEngineApi, stopEngineApi } from '@/services/raceApi';

interface EngineState {
  status: EngineStatus;
  duration: number;
}

interface RaceState {
  engines: Record<number, EngineState>;
  isRaceRunning: boolean;
  winnerId: number | null;
  status: 'idle' | 'racing' | 'resetting';
  error: string;
}

const initialState: RaceState = {
  engines: {},
  isRaceRunning: false,
  winnerId: null,
  status: 'idle',
  error: '',
};

export const startEngine = createAsyncThunkHelper<
  EngineResponse,
  { carId: number }
>('engine/startEngine', ({ carId }) => startEngineApi(carId));

export const stopEngine = createAsyncThunkHelper<
  EngineResponse,
  { carId: number }
>('engine/stopEngine', ({ carId }) => stopEngineApi(carId));

export const driveCar = createAsyncThunkHelper<
  SwitchDriveModeResponse,
  { carId: number }
>('engine/driveCar', ({ carId }) => driveCarApi(carId));

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    resetRace: (state) => {
      Object.assign(state, initialState);
    },
    setWinner: (state, action: PayloadAction<number | null>) => {
      state.winnerId = action.payload;
    },
    setRaceRunning: (state, action: PayloadAction<boolean>) => {
      state.isRaceRunning = action.payload;
    },
    setStatusBroken: (state, action: PayloadAction<number>) => {
      if (state.engines[action.payload]) {
        state.engines[action.payload].status = 'broken';
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startEngine.fulfilled, (state, action) => {
      const { velocity, distance } = action.payload;
      if (velocity === 0) {
        throw new Error('Invalid engine response: velocity cannot be zero');
      }
      const duration = distance / velocity;
      const carId = action.meta.arg.carId;
      state.engines[carId] = { status: 'started', duration };
    });

    builder.addCase(driveCar.fulfilled, (state, action) => {
      const carId = action.meta.arg.carId;
      if (state.engines[carId]) {
        state.engines[carId].status = 'driving';
      }
    });

    builder.addCase(stopEngine.fulfilled, (state, action) => {
      const carId = action.meta.arg.carId;
      if (state.engines[carId]) {
        state.engines[carId].status = 'stopped';
        state.engines[carId].duration = 0;
      }
    });
  },
});

export const getEngineById = (state: { race: RaceState }, id: number) =>
  state.race.engines[id];

export const getWinnerId = (state: { race: RaceState }) => state.race.winnerId;

export const { resetRace, setWinner, setRaceRunning, setStatusBroken } =
  raceSlice.actions;

export default raceSlice.reducer;
