export type User = {
  name: string;
  email: string;
};

export type UserSignUpPayload = {
  name: string;
  email: string;
  password: string;
};

export type UserAuthResponse = {
  token: string;
  user: User;
};
