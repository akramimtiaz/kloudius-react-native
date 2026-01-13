import { z } from "zod";
import type {
  UserAuthResponse,
  UserSignUpPayload,
} from "@/types/auth";

const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
});

const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export async function login(email: string, password: string): Promise<UserAuthResponse> {
  try {
    const response = {
      token: "1234567890",
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    };

    const parsed = AuthResponseSchema.safeParse(response);

    if (!parsed.success) {
      throw new Error("Response validation failed: " + z.treeifyError(parsed.error));
    }

    return Promise.resolve(parsed.data);
  } catch (err) {
    console.error('[API] Login:', err);
    return Promise.reject(err);
  }
}

export async function signUp(payload: UserSignUpPayload): Promise<UserAuthResponse> {
  try {
    const response = {
      token: "1234567890",
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    };

    const parsed = AuthResponseSchema.safeParse(response);
    if (!parsed.success) {
      throw new Error("Response validation failed: " + z.treeifyError(parsed.error));
    }

    return Promise.resolve(parsed.data);
  } catch (err) {
    console.error('[API] Sign up:', err);
    return Promise.reject(err);
  }
}
