export type User = {
  name: string;
  email: string;
};

export type UserSignUpPayload = {
  name: string;
  email: string;
  password: string;
};

export async function logIn(email: string, password: string) {
  try {
    console.log("email", email);
    console.log("password", password);
  } catch (err) {
    console.error(err);
  }
}

export async function signUp(payload: UserSignUpPayload) {
  try {
    console.log("payload", payload);
  } catch (err) {
    console.error(err);
  }
}
