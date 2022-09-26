import { configureStore } from '@reduxjs/toolkit'
import remoteReducer from './remote/remoteSlice'

export const store = configureStore({
  reducer: {
    remote: remoteReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch