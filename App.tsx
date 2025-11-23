import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { getTheme } from './src/constants/theme';
import { useAppInitialization } from './src/hooks/useAppInitialization';
import { useAppSelector } from './src/hooks/useRedux';
import { AppNavigator } from './src/navigation/AppNavigator';
import { store } from './src/store';

const AppContent = () => {
    const ready = useAppInitialization();
    const themeMode = useAppSelector((state: any) => state.darkMode?.mode ?? 'light');
    const theme = getTheme(themeMode);

    if (!ready) {
        return (
            <View style={[styles.loader, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.accent} />
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
        justifyContent: 'center'
    }
});
