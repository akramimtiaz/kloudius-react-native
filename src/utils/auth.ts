import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User, UserAuthResponse } from "@/types/auth";

const AUTH_TOKEN_KEY = `auth_token`;
const AUTH_USER_KEY = `auth_user`;

export async function saveAuthData(authData: UserAuthResponse): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(AUTH_TOKEN_KEY, authData.token),
      AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(authData.user)),
    ]);
  } catch (err) {
    console.error("Failed to save auth data to storage:", err);
    throw err;
  }
}

export async function loadAuthData(): Promise<UserAuthResponse | null> {
  try {
    const [savedToken, savedUserJson] = await Promise.all([
      AsyncStorage.getItem(AUTH_TOKEN_KEY),
      AsyncStorage.getItem(AUTH_USER_KEY),
    ]);

    if (!savedToken || !savedUserJson) {
      return null;
    }

    const savedUser = JSON.parse(savedUserJson) as User;
    
    return {
      token: savedToken,
      user: savedUser,
    };
  } catch (err) {
    console.error("Failed to load auth data from storage:", err);
    throw err;
  }
};

export async function clearAuthData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
  } catch (err) {
    console.error("Failed to clear auth data from storage:", err);
    throw err;
  }
}
