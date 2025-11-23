import axios from 'axios';
import { TMDB_BASE_URL } from '../constants';
import type { Movie, MovieDetails } from '../types/movie';

const getApiKey = () => {
  const key = process.env.EXPO_PUBLIC_TMDB_API_KEY;
  if (!key) {
    throw new Error(
      'TMDb API key missing. Create an API key and expose it as EXPO_PUBLIC_TMDB_API_KEY before fetching movies.'
    );
  }
  return key;
};

export const fetchTrendingMoviesFromApi = async (): Promise<Movie[]> => {
  const apiKey = getApiKey();
  const { data } = await axios.get<{ results: Movie[] }>(`${TMDB_BASE_URL}/trending/movie/week`, {
    params: { api_key: apiKey }
  });
  return data.results;
};

export const fetchMovieDetailsFromApi = async (movieId: number): Promise<MovieDetails> => {
  const apiKey = getApiKey();
  const { data } = await axios.get<MovieDetails>(`${TMDB_BASE_URL}/movie/${movieId}`, {
    params: { api_key: apiKey }
  });
  return data;
};
