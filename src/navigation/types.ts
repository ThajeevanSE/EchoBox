export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  Home: undefined;
  Songs: undefined;
  Podcasts: undefined;
  Favourites: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  Details: { movieId: number };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
