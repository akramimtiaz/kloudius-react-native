
export type User = {
  name: string;
  email: string;
};

export type UserLoginPayload = {
  email: string;
  password: string;
}

export type UserLoginResponse = {
  token: string;
  user: User;
}

export type UserSignUpPayload = {
  name: string;
  email: string;
  password: string;
}

export type UserSignUpResponse = {
  token: string;
  user: User;
}