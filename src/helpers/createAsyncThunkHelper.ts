import {
  createAsyncThunk,
  type AsyncThunk,
  type ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

interface SerializedError {
  message: string;
  code?: string | number;
}

interface ThunkApiConfig {
  rejectValue: SerializedError;
}

export function createAsyncThunkHelper<Returned, Arg = void>(
  typePrefix: string,
  payloadCreator: (arg: Arg) => Promise<Returned>
): AsyncThunk<Returned, Arg, ThunkApiConfig> {
  return createAsyncThunk<Returned, Arg, ThunkApiConfig>(
    typePrefix,
    async (arg, { rejectWithValue }) => {
      try {
        return await payloadCreator(arg);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return rejectWithValue({
            message: 'Request cancelled',
            code: 'ABORT_ERROR',
          });
        }

        if (err instanceof Error && err.message.startsWith('HTTP ')) {
          const [status, ...rest] = err.message.split(': ');
          return rejectWithValue({
            message: rest.join(': '),
            code: status,
          });
        }

        if (err instanceof Error) {
          return rejectWithValue({
            message: err.message,
          });
        }

        return rejectWithValue({
          message: String(err) || 'An unknown error occurred',
        });
      }
    }
  );
}

export interface StatusState<T = unknown> {
  status: 'idle' | 'loading' | 'success' | 'fail';
  data: T | undefined;
  error: string;
}

export function handleAsyncThunk<
  T,
  Arg,
  S extends { status: string; error: string },
  Thunk extends AsyncThunk<T, Arg, ThunkApiConfig>,
>(
  builder: ActionReducerMapBuilder<S>,
  thunk: Thunk,
  onFulfilled: (state: S, action: ReturnType<Thunk['fulfilled']>) => void
): ActionReducerMapBuilder<S> {
  return builder
    .addCase(thunk.pending, (state) => {
      state.status = 'loading';
      state.error = '';
    })
    .addCase(thunk.rejected, (state, action) => {
      state.status = 'fail';
      state.error = action.payload?.message ?? 'An error occurred';
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.status = 'success';
      state.error = '';
      onFulfilled(state as S, action as ReturnType<Thunk['fulfilled']>);
    });
}
