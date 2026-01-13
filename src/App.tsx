import "../global.css";
import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import ToastManager from 'toastify-react-native';

import { RootNavigation } from "./navigation";
import { AuthContextProvider } from "./contexts/auth";

Asset.loadAsync([...NavigationAssets]);

SplashScreen.preventAutoHideAsync();

export function App() {
  return (
    <AuthContextProvider>
      <React.Fragment>
        <RootNavigation />
        <ToastManager />
      </React.Fragment>
    </AuthContextProvider>
  );
}
