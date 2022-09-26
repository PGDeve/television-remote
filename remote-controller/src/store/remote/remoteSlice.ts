import { createSlice } from '@reduxjs/toolkit'
import { AppError, ChannelData } from '../../model/app.model'
import type { RootState } from '../store'

// Define a type for the slice state
interface RemoteState {
  isLoading: boolean,
  error: AppError | null,
  currentChannelData: ChannelData
}

// Define the initial state using that type
const initialState: RemoteState = {
  isLoading: true,
  error: null,
  currentChannelData: new ChannelData(),
}

export const remoteSlice = createSlice({
  name: 'remote',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsLoading: (state: RemoteState, { payload: isLoading }: { payload: boolean, type: string }) => {
      state.isLoading = isLoading;
    },
    setError: (state: RemoteState, { payload: error }: { payload: AppError | null, type: string }) => {
      state.error = error;
    },
    setCurrentChannel: (state: RemoteState, { payload: channelData }: { payload: ChannelData, type: string }) => {
      state.currentChannelData = channelData;
      state.isLoading = false;
    }
  },
})

export const { setIsLoading, setError, setCurrentChannel } = remoteSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIsLoading = (state: RootState) => state.remote.isLoading;
export const selectError = (state: RootState) => state.remote.error;
export const selectCurrentChannelData = (state: RootState) => state.remote.currentChannelData;

export default remoteSlice.reducer