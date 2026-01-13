import {
  createStaticNavigation,
  DarkTheme,
  DefaultTheme,
  StaticParamList,
} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, useIsAuthenticated, useIsUnauthenticated } from '@/contexts/auth';
// screens
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import { use, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { createURL } from 'expo-linking';

const RootStack = createNativeStackNavigator({
  groups: {
    Authenticated: {
      if: useIsAuthenticated,
      screens: {
        Home: HomeScreen,
      },
    },
    Unauthenticated: {
      if: useIsUnauthenticated,
      screens: {
        Login: LoginScreen,
        SignUp: SignUpScreen,
      },
    },
  }
});

const Navigation = createStaticNavigation(RootStack);

const prefix = createURL("/");

export function RootNavigation() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const { isLoadingAuthData } = use(AuthContext);

  useEffect(() => {
    if (isNavigationReady && !isLoadingAuthData) {
      SplashScreen.hideAsync();
    }
  }, [isNavigationReady, isLoadingAuthData]);
  
  return (
    <Navigation
      theme={theme}
      linking={{
        enabled: 'auto',
        prefixes: [prefix],
      }}
      onReady={() => {
        setIsNavigationReady(true);
      }}
    />
  )
}

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
