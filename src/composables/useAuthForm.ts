import { ref } from "vue";

type AuthView = "signin" | "signup";

export function useAuthForm() {
  const authView = ref<AuthView>("signin");

  const email = ref("");
  const password = ref("");

  const signupName = ref("");
  const signupEmail = ref("");
  const signupPassword = ref("");
  const signupBirthdate = ref("");

  const loadingSignup = ref(false);
  const loadingSignin = ref(false);

  function prepareSigninAfterSignup(createdEmail: string) {
    signupName.value = "";
    signupEmail.value = "";
    signupPassword.value = "";
    signupBirthdate.value = "";

    email.value = createdEmail;
    password.value = "";
    authView.value = "signin";
  }

  return {
    authView,
    email,
    password,
    signupName,
    signupEmail,
    signupPassword,
    signupBirthdate,
    loadingSignup,
    loadingSignin,
    prepareSigninAfterSignup,
  };
}