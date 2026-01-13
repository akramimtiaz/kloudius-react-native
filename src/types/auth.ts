
export type User = {
  name: string;
  email: string;
};

export type UserAuthResponse = {
  token: string;
  user: User;
}

export type UserSignUpPayload = {
  name: string;
  email: string;
  password: string;
}
