import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaListItem } from '../components/MediaListItem';
import { lightTheme } from '../constants/theme';
import type { MediaItem } from '../types/media';

const trendingPodcasts: MediaItem[] = [
  {
    id: 'pod-1',
    title: 'Futurecraft Daily',
    description: '8-minute breakdown of AI, startups, and UX experiments.',
    artwork:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=300&q=60',
    category: 'Tech Brief',
    duration: '8m',
    mood: 'Daily bite'
  },
  {
    id: 'pod-2',
    title: 'Wellness Debrief',
    description: 'Interviews with neuroscientists and trainers on sustainable habits.',
    artwork:
      'https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=300&q=60',
    category: 'Lifestyle',
    duration: '42m',
    mood: 'Thoughtful'
  },
  {
    id: 'pod-3',
    title: 'Design Signals',
    description: 'Product leads breakdown delightful mobile experiences.',
    artwork:
      'https://images.unsplash.com/photo-1421757350652-9f65a35effc7?auto=format&fit=crop&w=300&q=60',
    category: 'Product & UX',
    duration: '55m',
    mood: 'Deep dive'
  }
];

export const PodcastsScreen = () => (
  <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <View style={styles.container}>
      <Text style={styles.title}>Trending podcasts</Text>
      <Text style={styles.subtitle}>Hand-picked shows with the most buzz this week.</Text>
      <FlatList
        data={trendingPodcasts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <MediaListItem item={item} iconName="headphones" />}
      />
    </View>
  </SafeAreaView>
);

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
    color: lightTheme.text
  },
  subtitle: {
    color: lightTheme.secondaryText,
    marginBottom: 16
  },
  list: {
    paddingBottom: 32
  }
});
