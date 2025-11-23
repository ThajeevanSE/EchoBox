import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getTheme } from '../constants/theme';
import { useAppSelector } from '../hooks/useRedux';
import { DetailsScreen } from '../screens/DetailsScreen';
import { FavouritesScreen } from '../screens/FavouritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { PodcastsScreen } from '../screens/PodcastsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { SongsScreen } from '../screens/SongsScreen';
import type {
  AuthStackParamList,
  MainStackParamList,
  RootStackParamList,
  TabParamList
} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// navTheme will be computed inside component using the current theme mode

const AuthStackNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShadowVisible: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
    <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
  </AuthStack.Navigator>
);

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

const tabIcons: Record<keyof TabParamList, FeatherIconName> = {
  Home: 'home',
  Songs: 'music',
  Podcasts: 'headphones',
  Favourites: 'heart',
  Profile: 'user'
};

const TabNavigator = () => {
  const themeMode = useAppSelector((state: any) => state.darkMode?.mode ?? 'light');
  const theme = getTheme(themeMode);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6
        },
        tabBarIcon: ({ color, size }) => {
          const iconName =
            tabIcons[route.name as keyof TabParamList] ?? ('circle' as FeatherIconName);
          return <Feather name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Songs" component={SongsScreen} />
      <Tab.Screen name="Podcasts" component={PodcastsScreen} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const MainStackNavigator = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
    <MainStack.Screen
      name="Details"
      component={DetailsScreen}
      options={{ title: 'Movie details' }}
    />
  </MainStack.Navigator>
);

export const AppNavigator = () => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  const themeMode = useAppSelector((state: any) => state.darkMode?.mode ?? 'light');
  const theme = getTheme(themeMode);
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      primary: theme.accent,
      border: theme.border
    }
  };

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <RootStack.Screen name="Main" component={MainStackNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
