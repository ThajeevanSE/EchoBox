import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieCard } from '../components/MovieCard';
import { lightTheme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import type { MainStackParamList } from '../navigation/types';
import { removeFromFavourites } from '../store/slices/favouritesSlice';

export const FavouritesScreen = () => {
  const favourites = useAppSelector(state => state.favourites.favouriteMovies);
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.title}>Your favourites</Text>
        <FlatList
          data={favourites}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="film" size={32} color={lightTheme.secondaryText} />
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.emptySubtitle}>Save movies you like to access them quickly.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <MovieCard
              movie={item}
              onPress={() => navigation.navigate('Details', { movieId: item.id })}
              isFavourite
              showFavouriteIndicator
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => dispatch(removeFromFavourites(item.id))}
            >
              <Feather name='trash-2' size={16} color='#ef4444' />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        />
      </View>
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
    backgroundColor: lightTheme.background,
    paddingHorizontal: 16,
    paddingTop: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: lightTheme.text,
    marginBottom: 12
  },
  list: {
    paddingBottom: 32
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    marginTop: 40
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: lightTheme.text
  },
  emptySubtitle: {
    textAlign: 'center',
    color: lightTheme.secondaryText,
    paddingHorizontal: 32
  },
  cardWrapper: {
    marginBottom: 8
  },
  removeButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  removeText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600'
  }
});
