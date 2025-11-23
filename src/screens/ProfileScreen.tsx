import { Feather } from '@expo/vector-icons';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTheme } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logoutUser } from '../store/slices/authSlice';
import { setTheme } from '../store/slices/darkModeSlice';

export const ProfileScreen = () => {
  const user = useAppSelector(state => state.auth.user);
  const favourites = useAppSelector(state => state.favourites.favouriteMovies);
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state: any) => state.darkMode?.mode ?? 'light');
  const theme = getTheme(themeMode);

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    dispatch(setTheme(next));
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Feather name="user" size={28} color={theme.accent} />
          <View>
            <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
            <Text style={styles.email}>{user?.email ?? 'No email'}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{favourites.length}</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>TMDB</Text>
            <Text style={styles.statLabel}>Data source</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.row}>
            <Feather name="lock" size={18} color={theme.secondaryText} />
            <Text style={styles.rowText}>Your data is stored locally with AsyncStorage</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>Dark mode</Text>
            <Switch value={themeMode === 'dark'} onValueChange={toggleTheme} thumbColor={theme.card} trackColor={{ true: theme.accent }} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => dispatch(logoutUser())}>
          <Feather name="log-out" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      gap: 20
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      backgroundColor: theme.card,
      padding: 18,
      borderRadius: 16,
      shadowColor: '#0f172a',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 4
    },
    name: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text
    },
    email: {
      color: theme.secondaryText
    },
    stats: {
      flexDirection: 'row',
      gap: 12
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 14,
      alignItems: 'center'
    },
    statNumber: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.text
    },
    statLabel: {
      color: theme.secondaryText,
      marginTop: 4
    },
    section: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 14,
      gap: 12
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text
    },
    row: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center'
    },
    rowText: {
      color: theme.secondaryText,
      flex: 1
    },
    logoutButton: {
      marginTop: 'auto',
      backgroundColor: '#ef4444',
      paddingVertical: 14,
      borderRadius: 14,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600'
    }
  });

// Duplicate static styles removed — use createStyles(theme) inside the component,
// which derives styles from the active theme via getTheme(themeMode).
