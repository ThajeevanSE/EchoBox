import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchMovieDetailsFromApi } from '../services/movies';
import type { MainStackParamList } from '../navigation/types';
import { lightTheme } from '../constants/theme';
import { getPosterUrl } from '../utils/movies';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { addToFavourites, removeFromFavourites } from '../store/slices/favouritesSlice';
import type { MovieDetails } from '../types/movie';

type RouteProps = RouteProp<MainStackParamList, 'Details'>;

export const DetailsScreen = () => {
  const route = useRoute<RouteProps>();
  const dispatch = useAppDispatch();
  const { movieId } = route.params;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const favourites = useAppSelector(state => state.favourites.favouriteMovies);
  const isFavourite = favourites.some(item => item.id === movieId);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        const details = await fetchMovieDetailsFromApi(movieId);
        setMovie(details);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load details');
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [movieId]);

  const handleFavouriteToggle = () => {
    if (!movie) {
      return;
    }
    if (isFavourite) {
      dispatch(removeFromFavourites(movie.id));
    } else {
      dispatch(addToFavourites(movie));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={lightTheme.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!movie || error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.loader}>
          <Text style={styles.errorText}>{error ?? 'Movie not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Image source={{ uri: getPosterUrl(movie.poster_path) }} style={styles.poster} />
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.subtitle}>{movie.tagline}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Release: {movie.release_date ?? 'N/A'}</Text>
          <Text style={styles.metaText}>Rating: ⭐ {movie.vote_average?.toFixed(1) ?? 'NR'}</Text>
        </View>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>

        {movie.genres && movie.genres.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.genres}>
              {movie.genres.map(genre => (
                <View key={genre.id} style={styles.genrePill}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.favButton, isFavourite && styles.favButtonActive]}
          onPress={handleFavouriteToggle}
        >
          <Feather
            name={isFavourite ? 'check' : 'heart'}
            color={isFavourite ? '#fff' : lightTheme.accent}
            size={18}
          />
          <Text style={[styles.favButtonText, isFavourite && styles.favButtonTextActive]}>
            {isFavourite ? 'Added to favourites' : 'Add to favourites'}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightTheme.background
  },
  container: {
    flex: 1,
    backgroundColor: lightTheme.background
  },
  poster: {
    width: '100%',
    height: 420
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: lightTheme.text
  },
  subtitle: {
    color: lightTheme.secondaryText,
    marginTop: 4,
    marginBottom: 12
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  metaText: {
    color: lightTheme.secondaryText,
    fontSize: 13
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    color: lightTheme.text
  },
  overview: {
    fontSize: 15,
    color: lightTheme.secondaryText,
    lineHeight: 22
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  genrePill: {
    backgroundColor: `${lightTheme.accent}22`,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  genreText: {
    color: lightTheme.accent,
    fontSize: 12
  },
  favButton: {
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: lightTheme.accent,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  favButtonActive: {
    backgroundColor: lightTheme.accent,
    borderColor: lightTheme.accent
  },
  favButtonText: {
    color: lightTheme.accent,
    fontSize: 15,
    fontWeight: '600'
  },
  favButtonTextActive: {
    color: '#fff'
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lightTheme.background
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16
  }
});
