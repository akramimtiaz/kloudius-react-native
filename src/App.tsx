import '../global.css';
import { Assets as NavigationAssets } from '@react-navigation/elements';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { useColorScheme } from 'react-native';
import { Navigation } from './navigation';
import { use } from 'react';
import { AuthContext } from './ contexts/auth-context';

Asset.loadAsync([
  ...NavigationAssets,
]);

SplashScreen.preventAutoHideAsync();

const prefix = createURL('/');

export function App() {
  const colorScheme = useColorScheme();
  const { isLoadingAuthData } = use(AuthContext);
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const [isNavigationReady, setIsNavigationReady] = React.useState(false);

  // Hide splash screen only when both navigation and auth data are ready
  React.useEffect(() => {
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
  );
}
