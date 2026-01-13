import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// screens
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';

const isLoggedIn = false;

const RootStack = createNativeStackNavigator({
  groups: {
    Authenticated: {
      if: () => isLoggedIn,
      screens: {
        Home: HomeScreen,
      },
    },
    Unauthenticated: {
      if: () => isLoggedIn,
      screens: {
        Login: LoginScreen,
        SignUp: SignUpScreen,
      },
    },
  }
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
