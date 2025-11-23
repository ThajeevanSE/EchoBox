import { Image, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { lightTheme } from '../constants/theme';
import type { MediaItem } from '../types/media';

interface MediaListItemProps {
  item: MediaItem;
  iconName: React.ComponentProps<typeof Feather>['name'];
}

export const MediaListItem = ({ item, iconName }: MediaListItemProps) => (
  <View style={styles.card}>
    <Image source={{ uri: item.artwork }} style={styles.artwork} />
    <View style={styles.info}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{item.title}</Text>
        <Feather name={iconName} size={16} color={lightTheme.accent} />
      </View>
      <Text style={styles.metaText}>{item.category}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      {(item.duration || item.mood) && (
        <View style={styles.metaRow}>
          {item.duration && <Text style={styles.metaChip}>⏱ {item.duration}</Text>}
          {item.mood && <Text style={styles.metaChip}>🎧 {item.mood}</Text>}
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: lightTheme.card,
    padding: 12,
    borderRadius: 16,
    gap: 12,
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3
  },
  artwork: {
    width: 80,
    height: 80,
    borderRadius: 12
  },
  info: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: lightTheme.text
  },
  metaText: {
    color: lightTheme.secondaryText,
    fontSize: 12,
    marginBottom: 4
  },
  description: {
    color: lightTheme.secondaryText,
    fontSize: 13
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6
  },
  metaChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: `${lightTheme.accent}22`,
    borderRadius: 999,
    fontSize: 12,
    color: lightTheme.accent
  }
});
