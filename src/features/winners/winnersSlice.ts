import { createSlice } from '@reduxjs/toolkit';
import type { FetchWinnersParams, FetchWinnersResponse, Winner } from './types';
import {
  createAsyncThunkHelper,
  handleAsyncThunk,
} from '@/helpers/createAsyncThunkHelper';
import { deleteWinnerApi, getAllWinnersApi } from '@/services/winnerApi';

interface WinnersState {
  winners: Winner[];
  status: 'idle' | 'loading' | 'success' | 'fail';
  error: string;
  total: number;
}

const initialState: WinnersState = {
  winners: [],
  status: 'idle',
  error: '',
  total: 0,
};

export const fetchAllWinners = createAsyncThunkHelper<
  FetchWinnersResponse,
  FetchWinnersParams
>('winners/fetchAllWinners', ({ ...params }) =>
  getAllWinnersApi({ ...params })
);

export const deleteWinner = createAsyncThunkHelper<unknown, number>(
  'winners/deleteWinner',
  (id) => deleteWinnerApi(id)
);

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    handleAsyncThunk(builder, fetchAllWinners, (state, action) => {
      state.winners = action.payload.winners;
      state.total = action.payload.totalCount;
    });
    handleAsyncThunk(builder, deleteWinner, (state, action) => {
      state.winners = state.winners.filter(
        (winner) => winner.id !== action.meta.arg
      );
      state.total -= 1;
    });
  },
});

export default winnersSlice.reducer;
