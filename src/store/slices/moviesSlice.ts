import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Movie } from '../../types/movie';
import { fetchTrendingMoviesFromApi } from '../../services/movies';

interface MoviesState {
  trendingMovies: Movie[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MoviesState = {
  trendingMovies: [],
  status: 'idle',
  error: null
};

export const fetchTrendingMovies = createAsyncThunk<Movie[], void, { rejectValue: string }>(
  'movies/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const movies = await fetchTrendingMoviesFromApi();
      return movies;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to fetch trending movies. Please try again later.';
      return rejectWithValue(message);
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTrendingMovies.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.trendingMovies = action.payload;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load movies.';
      });
  }
});

export default moviesSlice.reducer;
