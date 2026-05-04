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

export type AuthResponse = {
  token: string;
};

export async function signup(input: SignupInput) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function signin(input: SigninInput) {
  return apiRequest<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify(input),
  });
}