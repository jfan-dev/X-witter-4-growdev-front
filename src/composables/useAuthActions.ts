import { signin, signup } from "../services/auth";

type SignupInput = {
  name: string;
  email: string;
  password: string;
  birthdate: string;
};

type SigninInput = {
  email: string;
  password: string;
};

export function useAuthActions() {
  async function createAccount(input: SignupInput) {
    return await signup(input);
  }

  async function signInWithEmail(input: SigninInput) {
    return await signin(input);
  }

  return {
    createAccount,
    signInWithEmail,
  };
}