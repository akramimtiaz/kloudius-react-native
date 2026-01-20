import { login, signUp } from "@/api/auth";
import { UserSignUpPayload } from "@/types/auth";

describe("authApi", () => {
  test("login succeeds for seeded user", async () => {
    await expect(login("john.doe@example.com", "password")).resolves.toMatchObject({
      token: "auth-token",
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    });
  });

  test("login fails for invalid credentials", async () => {
    await expect(login("john.doe@example.com", "wrong")).rejects.toThrow(
      "Invalid credentials"
    );
  });

  test("signUp creates a new user and login succeeds", async () => {
    const payload: UserSignUpPayload = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "secret123",
    };

    await expect(signUp(payload)).resolves.toMatchObject({
      token: "auth-token",
      user: {
        name: "Jane Doe",
        email: "jane.doe@example.com",
      },
    });

    await expect(login(payload.email, payload.password)).resolves.toMatchObject({
      user: {
        name: "Jane Doe",
        email: "jane.doe@example.com",
      },
    });
  });

  test("signUp fails when user already exists", async () => {
    const payload: UserSignUpPayload = {
      name: "Existing",
      email: "john.doe@example.com",
      password: "password",
    };

    await expect(signUp(payload)).rejects.toThrow(
      "Unable to create account"
    );
  });
});
