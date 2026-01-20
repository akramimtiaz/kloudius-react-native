import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveAuthData, loadAuthData, clearAuthData } from "@/utils/auth";
import type { UserAuthResponse } from "@/types/auth";

describe("authStorage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test("loadAuthData returns null when no data exists", async () => {
    await expect(loadAuthData()).resolves.toBeNull();
  });

  test("saveAuthData persists token and user", async () => {
    const authData: UserAuthResponse = {
      token: "token-123",
      user: { name: "Jane Doe", email: "jane@example.com" },
    };

    await saveAuthData(authData);
    const loaded = await loadAuthData();

    expect(loaded).toEqual(authData);
  });

  test("clearAuthData removes stored values", async () => {
    const authData: UserAuthResponse = {
      token: "token-123",
      user: { name: "Jane Doe", email: "jane@example.com" },
    };

    await saveAuthData(authData);
    await clearAuthData();

    await expect(loadAuthData()).resolves.toBeNull();
  });

  test("loadAuthData throws on invalid stored JSON", async () => {
    await AsyncStorage.setItem("auth_token", "token-123");
    await AsyncStorage.setItem("auth_user", "not-json");

    await expect(loadAuthData()).rejects.toThrow();
  });
});
