import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Movie } from '../../types/movie';
import { FAVOURITES_STORAGE_KEY } from '../../constants';
import type { RootState } from '..';

interface FavouritesState {
  favouriteMovies: Movie[];
  hydrated: boolean;
}

const initialState: FavouritesState = {
  favouriteMovies: [],
  hydrated: false
};

export const hydrateFavourites = createAsyncThunk<Movie[]>('favourites/hydrate', async () => {
  const stored = await AsyncStorage.getItem(FAVOURITES_STORAGE_KEY);
  return stored ? (JSON.parse(stored) as Movie[]) : [];
});

export const addToFavourites = createAsyncThunk<
  Movie[],
  Movie,
  { state: RootState; rejectValue: string }
>('favourites/add', async (movie, { getState, rejectWithValue }) => {
  try {
    const current = (getState().favourites.favouriteMovies ?? []) as Movie[];
    const exists = current.some(item => item.id === movie.id);
    const updated = exists ? current : [...current, movie];
    await AsyncStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return rejectWithValue('Unable to save favourites right now.');
  }
});

export const removeFromFavourites = createAsyncThunk<
  Movie[],
  number,
  { state: RootState; rejectValue: string }
>('favourites/remove', async (movieId, { getState, rejectWithValue }) => {
  try {
    const current = (getState().favourites.favouriteMovies ?? []) as Movie[];
    const updated = current.filter(item => item.id !== movieId);
    await AsyncStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return rejectWithValue('Unable to update favourites.');
  }
});

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(hydrateFavourites.fulfilled, (state, action) => {
        state.favouriteMovies = action.payload;
        state.hydrated = true;
      })
      .addCase(hydrateFavourites.rejected, state => {
        state.hydrated = true;
      })
      .addCase(addToFavourites.fulfilled, (state, action) => {
        state.favouriteMovies = action.payload;
      })
      .addCase(removeFromFavourites.fulfilled, (state, action) => {
        state.favouriteMovies = action.payload;
      });
  }
});

export default favouritesSlice.reducer;
