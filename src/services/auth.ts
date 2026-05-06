import { apiRequest } from "./api";

export type SignupInput = {
  name: string;
  email: string;
  password: string;
  birthdate: string;
};

export type SigninInput = {
  email: string;
  password: string;
};

export type LoggedUser = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
};

export type SigninResponse = {
  token: string;
  user: LoggedUser;
};

export async function signup(input: SignupInput) {
  return apiRequest<LoggedUser>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function signin(input: SigninInput) {
  return apiRequest<SigninResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(input),
  });
}