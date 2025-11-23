import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Movie } from '../types/movie';
import { getPosterUrl, getMovieStatusLabel } from '../utils/movies';
import { lightTheme } from '../constants/theme';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  isFavourite?: boolean;
  showFavouriteIndicator?: boolean;
}

export const MovieCard = ({
  movie,
  onPress,
  isFavourite,
  showFavouriteIndicator = false
}: MovieCardProps) => {
  const badgeLabel = getMovieStatusLabel(movie);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: getPosterUrl(movie.poster_path) }} style={styles.poster} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        </View>
        <Text style={styles.overview} numberOfLines={3}>
          {movie.overview || 'No description available.'}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⭐ {movie.vote_average?.toFixed(1) ?? 'NR'}</Text>
          <Text style={styles.metaText}>{movie.release_date?.slice(0, 4) ?? 'N/A'}</Text>
          {showFavouriteIndicator && (
            <Feather
              name="heart"
              size={18}
              color={isFavourite ? lightTheme.accent : lightTheme.secondaryText}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: lightTheme.card,
    borderRadius: 16,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#0f172a',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4
  },
  poster: {
    width: 90,
    height: 130,
    borderRadius: 12,
    marginRight: 12
  },
  content: {
    flex: 1,
    justifyContent: 'space-between'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: lightTheme.text
  },
  badge: {
    backgroundColor: `${lightTheme.accent}33`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999
  },
  badgeText: {
    fontSize: 12,
    color: lightTheme.accent,
    fontWeight: '500'
  },
  overview: {
    fontSize: 13,
    color: lightTheme.secondaryText,
    marginVertical: 6
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12
  },
  metaText: {
    fontSize: 12,
    color: lightTheme.secondaryText
  }
});
