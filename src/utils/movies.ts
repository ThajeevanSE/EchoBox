import { TMDB_IMAGE_BASE_URL, POPULAR_LABEL_THRESHOLD, TRENDING_LABEL_THRESHOLD } from '../constants';
import type { Movie } from '../types/movie';

export const getPosterUrl = (posterPath?: string | null) => {
  if (!posterPath) {
    return 'https://via.placeholder.com/300x450?text=No+Image';
  }
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
};

export const getMovieStatusLabel = (movie: Movie) => {
  const popularity = movie.popularity ?? 0;
  if (popularity > TRENDING_LABEL_THRESHOLD) {
    return 'Trending';
  }
  if (popularity > POPULAR_LABEL_THRESHOLD) {
    return 'Popular';
  }
  return 'Recommended';
};
