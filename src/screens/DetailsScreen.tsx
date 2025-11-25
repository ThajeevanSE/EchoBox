import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { fetchMovieDetailsFromApi } from '../services/movies';
import type { MainStackParamList } from '../navigation/types';
import { lightTheme } from '../constants/theme';
import { getPosterUrl } from '../utils/movies';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { addToFavourites, removeFromFavourites } from '../store/slices/favouritesSlice';
import type { MovieDetails } from '../types/movie';

type RouteProps = RouteProp<MainStackParamList, 'Details'>;

const { width } = Dimensions.get('window');

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
          <Text style={styles.loadingText}>Loading movie details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!movie || error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.loader}>
          <Feather name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error ?? 'Movie not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero Section with Poster */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: getPosterUrl(movie.poster_path) }} 
            style={styles.poster}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
            style={styles.gradient}
          />
          
          {/* Floating Favourite Button */}
          <TouchableOpacity
            style={styles.floatingFavButton}
            onPress={handleFavouriteToggle}
          >
            <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
              <Feather
                name={isFavourite ? 'heart' : 'heart'}
                color={isFavourite ? '#ff006e' : '#fff'}
                size={24}
                fill={isFavourite ? '#ff006e' : 'transparent'}
              />
            </BlurView>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{movie.title}</Text>
            {movie.tagline && (
              <Text style={styles.subtitle}>"{movie.tagline}"</Text>
            )}
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Feather name="calendar" size={16} color={lightTheme.accent} />
              <Text style={styles.statLabel}>Release</Text>
              <Text style={styles.statValue}>
                {new Date(movie.release_date).getFullYear() || 'N/A'}
              </Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardAccent]}>
              <Feather name="star" size={16} color="#fff" />
              <Text style={styles.statLabelWhite}>Rating</Text>
              <Text style={styles.statValueWhite}>
                {movie.vote_average?.toFixed(1) ?? 'NR'}
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <Feather name="clock" size={16} color={lightTheme.accent} />
              <Text style={styles.statLabel}>Runtime</Text>
              <Text style={styles.statValue}>
                {movie.runtime ? `${movie.runtime}m` : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.genresSection}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.genresScroll}
              >
                {movie.genres.map(genre => (
                  <View key={genre.id} style={styles.genrePill}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Overview */}
          <View style={styles.overviewSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={styles.sectionTitle}>Synopsis</Text>
            </View>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, isFavourite && styles.actionButtonActive]}
            onPress={handleFavouriteToggle}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isFavourite 
                ? [lightTheme.accent, lightTheme.accent] 
                : ['transparent', 'transparent']}
              style={styles.buttonGradient}
            >
              <Feather
                name={isFavourite ? 'check-circle' : 'plus-circle'}
                color={isFavourite ? '#fff' : lightTheme.accent}
                size={20}
              />
              <Text style={[styles.actionButtonText, isFavourite && styles.actionButtonTextActive]}>
                {isFavourite ? 'In Your Favourites' : 'Add to Favourites'}
              </Text>
            </LinearGradient>
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
  heroContainer: {
    width: '100%',
    height: 500,
    position: 'relative'
  },
  poster: {
    width: '100%',
    height: '100%'
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200
  },
  floatingFavButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  blurContainer: {
    padding: 12,
    borderRadius: 50
  },
  content: {
    padding: 20,
    paddingTop: 24
  },
  titleSection: {
    marginBottom: 24
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: lightTheme.text,
    letterSpacing: -0.5,
    marginBottom: 8
  },
  subtitle: {
    color: lightTheme.secondaryText,
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 4
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6
  },
  statCardAccent: {
    backgroundColor: lightTheme.accent
  },
  statLabel: {
    fontSize: 11,
    color: lightTheme.secondaryText,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statLabelWhite: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: lightTheme.text
  },
  statValueWhite: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff'
  },
  genresSection: {
    marginBottom: 28
  },
  genresScroll: {
    paddingRight: 20
  },
  genrePill: {
    backgroundColor: `${lightTheme.accent}15`,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: `${lightTheme.accent}30`
  },
  genreText: {
    color: lightTheme.accent,
    fontSize: 13,
    fontWeight: '600'
  },
  overviewSection: {
    marginBottom: 32
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    backgroundColor: lightTheme.accent,
    borderRadius: 2,
    marginRight: 8
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: lightTheme.text
  },
  overview: {
    fontSize: 15,
    color: lightTheme.secondaryText,
    lineHeight: 24,
    letterSpacing: 0.2
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: lightTheme.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  actionButtonActive: {
    shadowOpacity: 0.3
  },
  buttonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: lightTheme.accent,
    borderRadius: 16
  },
  actionButtonText: {
    color: lightTheme.accent,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  actionButtonTextActive: {
    color: '#fff'
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lightTheme.background,
    gap: 16
  },
  loadingText: {
    color: lightTheme.secondaryText,
    fontSize: 14
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600'
  }
});