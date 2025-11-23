import { NavigationProp, useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieCard } from '../components/MovieCard';
import { lightTheme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import type { MainStackParamList, TabParamList } from '../navigation/types';
import { fetchTrendingMovies } from '../store/slices/moviesSlice';

type HomeScreenNav = CompositeNavigationProp<
  NavigationProp<MainStackParamList>,
  NavigationProp<TabParamList>
>;

const quickLinks = [
  {
    id: 'songs',
    label: 'Trending songs',
    caption: 'Fresh drops + vibes',
    icon: 'music' as const,
    target: 'Songs' as keyof TabParamList,
    background: '#eef2ff',
    textColor: '#4c1d95'
  },
  {
    id: 'podcasts',
    label: 'Top podcasts',
    caption: 'Daily discoverables',
    icon: 'headphones' as const,
    target: 'Podcasts' as keyof TabParamList,
    background: '#fff7ed',
    textColor: '#9a3412'
  }
];

export const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<HomeScreenNav>();
  const { trendingMovies, status, error } = useAppSelector(state => state.movies);
  const userName = useAppSelector(state => state.auth.user?.name ?? 'Movie Fan');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTrendingMovies());
    }
  }, [dispatch, status]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchTrendingMovies());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {userName.split(' ')[0]}</Text>
          <Text style={styles.headline}>Discover what&apos;s trending this week</Text>
        </View>
      <View style={styles.quickLinks}>
        {quickLinks.map(link => (
          <TouchableOpacity
            key={link.id}
            style={[styles.quickLinkCard, { backgroundColor: link.background }]}
            onPress={() => navigation.navigate(link.target)}
          >
            <Feather name={link.icon} size={20} color={link.textColor} />
            <Text style={[styles.quickLinkLabel, { color: link.textColor }]}>{link.label}</Text>
            <Text style={[styles.quickLinkCaption, { color: link.textColor }]}>{link.caption}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {status === 'loading' && trendingMovies.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={lightTheme.accent} />
        </View>
      ) : (
        <FlatList
          data={trendingMovies}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => navigation.navigate('Details', { movieId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={handleRefresh}
              tintColor={lightTheme.accent}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No movies found</Text>
              <Text style={styles.emptySubtitle}>
                {error ?? 'Pull to refresh and try again.'}
              </Text>
            </View>
          }
        />
      )}
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
    paddingTop: 8
  },
  header: {
    paddingVertical: 12
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: lightTheme.text
  },
  headline: {
    fontSize: 15,
    color: lightTheme.secondaryText,
    marginTop: 4
  },
  list: {
    paddingBottom: 32
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  quickLinkCard: {
    flex: 1,
    backgroundColor: lightTheme.card,
    borderRadius: 14,
    padding: 14,
    gap: 4,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2
  },
  quickLinkLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: lightTheme.text
  },
  quickLinkCaption: {
    color: lightTheme.secondaryText,
    fontSize: 12
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 6
  },
  emptyTitle: {
    fontSize: 18,
    color: lightTheme.text,
    fontWeight: '600'
  },
  emptySubtitle: {
    color: lightTheme.secondaryText,
    textAlign: 'center',
    paddingHorizontal: 32
  }
});
