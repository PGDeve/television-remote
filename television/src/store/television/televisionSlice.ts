import { createSlice } from '@reduxjs/toolkit'
import { AppError, ChannelData } from '../../model/app.model'
import { RootState } from '../store'

// Define a type for the slice state
interface TelevisionState {
  isLoading: boolean
  error: AppError | null
  currentChannelData: ChannelData
}

// Define the initial state using that type
const initialState: TelevisionState = {
  isLoading: true,
  error: null,
  currentChannelData: new ChannelData()
}

export const televisionSlice = createSlice({
  name: 'television',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIsLoading: (state: TelevisionState, { payload: isLoading }: { payload: boolean, type: string }) => {
      state.isLoading = isLoading;
    },
    setError: (state: TelevisionState, { payload: error }: { payload: AppError | null, type: string }) => {
      state.error = error;
    },
    setCurrentChannelData: (state: TelevisionState, { payload: channelData }: { payload: ChannelData, type: string }) => {
      if (state.currentChannelData.code !== channelData.code) {
        // Only set isLoading = true if channel actually changed
        state.isLoading = true;
      }
      state.currentChannelData = channelData;
    }
  },
})

export const { setIsLoading, setError, setCurrentChannelData } = televisionSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectIsLoading = (state: RootState) => state.television.isLoading;
export const selectError = (state: RootState) => state.television.error;
export const selectCurrentChannelData = (state: RootState) => state.television.currentChannelData;

export default televisionSlice.reducer