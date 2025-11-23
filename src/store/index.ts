import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import darkModeReducer from './slices/darkModeSlice';
import favouritesReducer from './slices/favouritesSlice';
import moviesReducer from './slices/moviesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    favourites: favouritesReducer
    , darkMode: darkModeReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
