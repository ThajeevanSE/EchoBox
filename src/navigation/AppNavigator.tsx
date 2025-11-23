import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { SongsScreen } from '../screens/SongsScreen';
import { PodcastsScreen } from '../screens/PodcastsScreen';
import { FavouritesScreen } from '../screens/FavouritesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { lightTheme } from '../constants/theme';
import { useAppSelector } from '../hooks/useRedux';
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

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: lightTheme.background,
    card: lightTheme.card,
    text: lightTheme.text,
    primary: lightTheme.accent,
    border: lightTheme.border
  }
};

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

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: lightTheme.accent,
      tabBarInactiveTintColor: lightTheme.secondaryText,
      tabBarStyle: {
        backgroundColor: lightTheme.card,
        borderTopColor: lightTheme.border,
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
