import { configureStore } from '@reduxjs/toolkit';
import appReducer from './store/appSlice';
import playableContentReducer from './store/playContentSlice';
import serverReducer from './store/serverSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    server: serverReducer,
    playableContent: playableContentReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
