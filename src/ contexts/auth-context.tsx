import { createContext, PropsWithChildren, useState } from "react";
import type { User, UserSignUpPayload } from "@/api/auth";
import * as authApi from "@/api/auth";

type AuthState = {
  isLoggedIn: boolean;
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
  const [user, setUser] = useState<User | undefined>();
  
  const isLoggedIn = !!user;

  const signUp = async (payload: UserSignUpPayload) => {
    try {
      // add zod validation
      await authApi.signUp(payload);
    } catch (err) {
      console.error("Trying to signup:", err);
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      // add zod validation
      const response = await authApi.logIn(email, password);
      console.log("response", response);
    } catch (err) {
      console.error("Trying to login:", err);
    }
  };

  const logOut = () => {
    setUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        logIn,
        logOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
