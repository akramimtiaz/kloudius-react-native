import { createContext, PropsWithChildren, useState } from "react";
import type { User, UserSignUpPayload } from "@/types/auth";
import * as authApi from "@/api/auth";

type AuthState = {
  isLoggedIn: boolean;
  authToken?: string;
  user?: User;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
  signUp: (payload: UserSignUpPayload) => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  logIn: async () => {},
  logOut: () => {},
  signUp: async () => {},
});

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [authToken, setAuthToken] = useState<string | undefined>();
  const [user, setUser] = useState<User | undefined>();
  
  const isLoggedIn = Boolean(authToken);

  const signUp = async (payload: UserSignUpPayload) => {
    try {
      const { token, user } = await authApi.signUp(payload);
      setAuthToken(token);
      setUser(user);
    } catch (err) {
      console.error("Trying to signup:", err);
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      const { token, user } = await authApi.login(email, password);
      setAuthToken(token);
      setUser(user);
    } catch (err) {
      console.error("Trying to login:", err);
    }
  };

  const logOut = () => {
    setAuthToken(undefined);
    setUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        authToken,
        logIn,
        logOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
