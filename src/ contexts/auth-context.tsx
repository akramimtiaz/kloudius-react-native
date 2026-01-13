import { createContext, PropsWithChildren, useEffect, useState } from "react";
import type { User, UserSignUpPayload } from "@/types/auth";
import * as authApi from "@/api/auth";
import * as authStorage from "@/utils/auth";

type AuthState = {
  isAuthenticated: boolean;
  authToken?: string;
  user?: User;
  isLoadingAuthData: boolean;
  login: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  signUp: (payload: UserSignUpPayload) => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
  isAuthenticated: false,
  isLoadingAuthData: true,
  login: async () => {},
  logOut: async () => {},
  signUp: async () => {},
});

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [authToken, setAuthToken] = useState<string | undefined>();
  const [user, setUser] = useState<User | undefined>();
  const [isLoadingAuthData, setIsLoadingAuthData] = useState(true);

  const isAuthenticated = Boolean(authToken);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        setIsLoadingAuthData(true);
        const authData = await authStorage.loadAuthData();

        if (authData) {
          setAuthToken(authData.token);
          setUser(authData.user);
        }
      } catch (err) {
        console.error("Loading auth data:", err);
      } finally {
        setIsLoadingAuthData(false);
      }
    };

    loadAuthData();
  }, []);


  const signUp = async (payload: UserSignUpPayload) => {
    try {
      const response = await authApi.signUp(payload);
      await authStorage.saveAuthData(response);

      setAuthToken(response.token);
      setUser(response.user);
    } catch (err) {
      console.error("Trying to signup:", err);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      await authStorage.saveAuthData(response);

      setAuthToken(response.token);
      setUser(response.user);
    } catch (err) {
      console.error("Trying to login:", err);
      throw err;
    }
  };

  const logOut = async () => {
    try {
      await authStorage.clearAuthData();
      setAuthToken(undefined);
      setUser(undefined);
    } catch (err) {
      console.error("Trying to logout:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authToken,
        isLoadingAuthData,
        login,
        logOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
