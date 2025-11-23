import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaListItem } from '../components/MediaListItem';
import { lightTheme } from '../constants/theme';
import type { MediaItem } from '../types/media';

const trendingSongs: MediaItem[] = [
  {
    id: 'song-1',
    title: 'Eternal Echo',
    description: 'A dreamy synthwave track dominating the chill charts this week.',
    artwork:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=60',
    category: 'Synthwave • Nova Pulse',
    duration: '3m 42s',
    mood: 'Night drive'
  },
  {
    id: 'song-2',
    title: 'Golden Hour Groove',
    description: 'Upbeat alt-pop bend with warm guitars and layered harmonies.',
    artwork:
      'https://images.unsplash.com/photo-1470225649543-e000d19af7ec?auto=format&fit=crop&w=300&q=60',
    category: 'Alt Pop • Lumen',
    duration: '2m 58s',
    mood: 'Feel good'
  },
  {
    id: 'song-3',
    title: 'Momentum',
    description: 'High energy instrumental perfect for gym or study focus.',
    artwork:
      'https://images.unsplash.com/photo-1454922915609-78549ad709bb?auto=format&fit=crop&w=300&q=60',
    category: 'Instrumental • Flux',
    duration: '4m 15s',
    mood: 'Motivation'
  }
];

export const SongsScreen = () => (
  <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
    <View style={styles.container}>
      <Text style={styles.title}>Trending songs</Text>
      <Text style={styles.subtitle}>Curated daily from social buzz + streaming charts.</Text>
      <FlatList
        data={trendingSongs}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <MediaListItem item={item} iconName="music" />}
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
