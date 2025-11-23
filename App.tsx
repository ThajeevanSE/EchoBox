import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { store } from './src/store';
import { useAppInitialization } from './src/hooks/useAppInitialization';
import { AppNavigator } from './src/navigation/AppNavigator';
import { lightTheme } from './src/constants/theme';

const AppContent = () => {
  const ready = useAppInitialization();

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={lightTheme.accent} />
      </View>
    );
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: lightTheme.background
  }
});
