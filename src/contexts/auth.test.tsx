import { renderHook, act, waitFor } from "@testing-library/react-native";
import { use } from "react";
import { AuthContextProvider, AuthContext } from "@/contexts/auth";
import type { UserAuthResponse } from "@/types/auth";
import * as authApi from "@/api/auth";
import * as authStorage from "@/utils/auth";

jest.mock("@/api/auth");
jest.mock("@/utils/auth");

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;
const mockedAuthStorage = authStorage as jest.Mocked<typeof authStorage>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthContextProvider>{children}</AuthContextProvider>
);

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads auth data on mount", async () => {
    const authData: UserAuthResponse = {
      token: "token-123",
      user: { name: "John Doe", email: "john@example.com" },
    };

    mockedAuthStorage.loadAuthData.mockResolvedValue(authData);

    const { result } = renderHook(() => use(AuthContext), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingAuthData).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.authToken).toBe("token-123");
    expect(result.current.user).toEqual(authData.user);
  });

  test("login updates auth state", async () => {
    mockedAuthStorage.loadAuthData.mockResolvedValue(null);

    const authData: UserAuthResponse = {
      token: "token-456",
      user: { name: "Jane Doe", email: "jane@example.com" },
    };

    mockedAuthApi.login.mockResolvedValue(authData);
    mockedAuthStorage.saveAuthData.mockResolvedValue();

    const { result } = renderHook(() => use(AuthContext), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingAuthData).toBe(false);
    });

    await act(async () => {
      await result.current.login("jane@example.com", "password");
    });

    expect(mockedAuthApi.login).toHaveBeenCalledWith(
      "jane@example.com",
      "password"
    );
    expect(mockedAuthStorage.saveAuthData).toHaveBeenCalledWith(authData);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(authData.user);
  });

  test("signUp updates auth state", async () => {
    mockedAuthStorage.loadAuthData.mockResolvedValue(null);

    const authData: UserAuthResponse = {
      token: "token-789",
      user: { name: "New User", email: "new@example.com" },
    };

    mockedAuthApi.signUp.mockResolvedValue(authData);
    mockedAuthStorage.saveAuthData.mockResolvedValue();

    const { result } = renderHook(() => use(AuthContext), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingAuthData).toBe(false);
    });

    await act(async () => {
      await result.current.signUp({
        name: "New User",
        email: "new@example.com",
        password: "password",
      });
    });

    expect(mockedAuthApi.signUp).toHaveBeenCalled();
    expect(mockedAuthStorage.saveAuthData).toHaveBeenCalledWith(authData);
    expect(result.current.isAuthenticated).toBe(true);
  });

  test("logOut clears auth state", async () => {
    const authData: UserAuthResponse = {
      token: "token-123",
      user: { name: "John Doe", email: "john@example.com" },
    };

    mockedAuthStorage.loadAuthData.mockResolvedValue(authData);
    mockedAuthStorage.clearAuthData.mockResolvedValue();

    const { result } = renderHook(() => use(AuthContext), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await result.current.logOut();
    });

    expect(mockedAuthStorage.clearAuthData).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.authToken).toBeUndefined();
  });

  test("login throws on failure", async () => {
    mockedAuthStorage.loadAuthData.mockResolvedValue(null);
    mockedAuthApi.login.mockRejectedValue(new Error("Invalid credentials"));

    const { result } = renderHook(() => use(AuthContext), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoadingAuthData).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.login("bad@example.com", "bad");
      })
    ).rejects.toThrow("Invalid credentials");
  });
});
