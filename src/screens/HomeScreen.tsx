import { NavigationProp, useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MovieCard } from '../components/MovieCard';
import { lightTheme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import type { MainStackParamList, TabParamList } from '../navigation/types';
import { fetchTrendingMovies } from '../store/slices/moviesSlice';

type HomeScreenNav = CompositeNavigationProp<
  NavigationProp<MainStackParamList>,
  NavigationProp<TabParamList>
>;

const { width } = Dimensions.get('window');

const quickLinks = [
  {
    id: 'songs',
    label: 'Trending songs',
    caption: 'Fresh drops + vibes',
    icon: 'music' as const,
    target: 'Songs' as keyof TabParamList,
    gradient: ['#667eea', '#764ba2'],
    iconBg: 'rgba(255,255,255,0.25)'
  },
  {
    id: 'podcasts',
    label: 'Top podcasts',
    caption: 'Daily discoverables',
    icon: 'headphones' as const,
    target: 'Podcasts' as keyof TabParamList,
    gradient: ['#f093fb', '#f5576c'],
    iconBg: 'rgba(255,255,255,0.25)'
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

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Good morning';
    if (hour < 18) return '🌤️ Good afternoon';
    return '🌙 Good evening';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.timeGreeting}>{getTimeOfDay()}</Text>
              <Text style={styles.greeting}>{userName.split(' ')[0]}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.profileGradient}
              >
                <Text style={styles.profileInitial}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={styles.headline}>Discover what's trending this week</Text>
        </View>

        {/* Quick Access Cards */}
        <View style={styles.quickAccessSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <Feather name="zap" size={14} color={lightTheme.accent} />
          </View>
          
          <View style={styles.quickLinks}>
            {quickLinks.map((link, index) => (
              <TouchableOpacity
                key={link.id}
                style={[styles.quickLinkCard, { width: (width - 52) / 2 }]}
                onPress={() => navigation.navigate(link.target)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={link.gradient}
                  style={styles.quickLinkGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={[styles.iconCircle, { backgroundColor: link.iconBg }]}>
                    <Feather name={link.icon} size={22} color="#fff" />
                  </View>
                  <View style={styles.quickLinkTextContainer}>
                    <Text style={styles.quickLinkLabel} numberOfLines={1}>
                      {link.label}
                    </Text>
                    <Text style={styles.quickLinkCaption} numberOfLines={1}>
                      {link.caption}
                    </Text>
                  </View>
                  <Feather name="arrow-right" size={18} color="rgba(255,255,255,0.8)" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Movies Section */}
        <View style={styles.moviesHeader}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <View style={styles.trendingBadge}>
              <Text style={styles.trendingBadgeText}>🔥 Hot</Text>
            </View>
          </View>
        </View>

        {status === 'loading' && trendingMovies.length === 0 ? (
          <View style={styles.loader}>
            <View style={styles.loaderContent}>
              <ActivityIndicator size="large" color={lightTheme.accent} />
              <Text style={styles.loadingText}>Loading amazing movies...</Text>
            </View>
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
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={status === 'loading'}
                onRefresh={handleRefresh}
                tintColor={lightTheme.accent}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Feather name="film" size={48} color={lightTheme.secondaryText} />
                </View>
                <Text style={styles.emptyTitle}>No movies found</Text>
                <Text style={styles.emptySubtitle}>
                  {error ?? 'Pull down to refresh and discover trending movies'}
                </Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={handleRefresh}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.retryGradient}
                  >
                    <Feather name="refresh-cw" size={18} color="#fff" />
                    <Text style={styles.retryText}>Try Again</Text>
                  </LinearGradient>
                </TouchableOpacity>
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
    backgroundColor: lightTheme.background
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  timeGreeting: {
    fontSize: 15,
    color: lightTheme.secondaryText,
    marginBottom: 6,
    fontWeight: '500'
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: lightTheme.text,
    letterSpacing: -0.5
  },
  profileButton: {
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  profileGradient: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff'
  },
  headline: {
    fontSize: 16,
    color: lightTheme.secondaryText,
    lineHeight: 24
  },
  quickAccessSection: {
    paddingHorizontal: 20,
    marginBottom: 28
  },
  moviesHeader: {
    paddingHorizontal: 20,
    marginBottom: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: lightTheme.accent
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: lightTheme.text,
    letterSpacing: 0.2,
    flex: 1
  },
  trendingBadge: {
    backgroundColor: `${lightTheme.accent}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  trendingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: lightTheme.accent
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 12
  },
  quickLinkCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12
  },
  quickLinkGradient: {
    padding: 18,
    gap: 12
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  quickLinkTextContainer: {
    flex: 1,
    gap: 4
  },
  quickLinkLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2
  },
  quickLinkCaption: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500'
  },
  list: {
    paddingBottom: 32,
    paddingHorizontal: 20
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  loaderContent: {
    alignItems: 'center',
    gap: 16
  },
  loadingText: {
    fontSize: 15,
    color: lightTheme.secondaryText,
    fontWeight: '500'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 16
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${lightTheme.accent}08`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  emptyTitle: {
    fontSize: 22,
    color: lightTheme.text,
    fontWeight: '700',
    marginTop: 4
  },
  emptySubtitle: {
    fontSize: 15,
    color: lightTheme.secondaryText,
    textAlign: 'center',
    lineHeight: 22
  },
  retryButton: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },
  retryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14
  },
  retryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3
  }
});