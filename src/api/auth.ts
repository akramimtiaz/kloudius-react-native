import { z } from "zod";
import type { UserAuthResponse, UserSignUpPayload } from "@/types/auth";

const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
});

const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

type StoredUser = {
  name: string;
  email: string;
  password: string;
};

const users: StoredUser[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password",
  },
];

export async function login(
  email: string,
  password: string
): Promise<UserAuthResponse> {
  try {
    const user = users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials. Please check your details.");
    }

    const token = 'auth-token';
  
    const response: UserAuthResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    // in the real world the line above would be a call to an API to get a token and user data
    // this is why we need to validate the response
    const parsed = AuthResponseSchema.safeParse(response);

    if (!parsed.success) {
      throw new Error(
        "Response validation failed: " + z.treeifyError(parsed.error)
      );
    }

    return Promise.resolve(parsed.data);
  } catch (err) {
    console.error("[API] Login:", err);
    return Promise.reject(err);
  }
}

export async function signUp(
  payload: UserSignUpPayload
): Promise<UserAuthResponse> {
  try {
    const existingUser = users.find((u) => u.email === payload.email);

    if (existingUser) {
      console.error("User with this email already exists.");
      throw new Error("Unable to create account. Please try again.");
    }

    users.push(payload);

    const token = 'auth-token';

    const response: UserAuthResponse = {
      token,
      user: {
        name: payload.name,
        email: payload.email,
      },
    };

    // in the real world the line above would be a call to an API to get a token and user data
    // this is why we need to validate the response
    const parsed = AuthResponseSchema.safeParse(response);

    if (!parsed.success) {
      throw new Error(
        "Response validation failed: " + z.treeifyError(parsed.error)
      );
    }

    return Promise.resolve(parsed.data);
  } catch (err) {
    console.error("[API] Sign up:", err);
    return Promise.reject(err);
  }
}
