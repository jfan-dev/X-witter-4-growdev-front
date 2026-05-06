<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import AppMainGrid from "../components/layout/AppMainGrid.vue";
import AuthCard from "../components/auth/AuthCard.vue";
import FeedbackMessage from "../components/FeedbackMessage.vue";
import WelcomeCard from "../components/WelcomeCard.vue";

import { useAuth } from "../composables/useAuth";
import { useAuthActions } from "../composables/useAuthActions";
import { useAuthForm } from "../composables/useAuthForm";
import { useFeedback } from "../composables/useFeedback";
import { getErrorMessage } from "../utils/getErrorMessage";

const router = useRouter();

const { isAuthenticated, saveSession } = useAuth();

const {
  message,
  error,
  clearFeedback,
  setSuccessFeedback,
  setErrorFeedback,
} = useFeedback();

const {
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
} = useAuthForm();

const {
  createAccount,
  signInWithEmail,
} = useAuthActions();

async function handleSignup() {
  clearFeedback();
  loadingSignup.value = true;

  try {
    await createAccount({
      name: signupName.value,
      email: signupEmail.value,
      password: signupPassword.value,
      birthdate: signupBirthdate.value,
    });

    const createdEmail = signupEmail.value;

    prepareSigninAfterSignup(createdEmail);

    setSuccessFeedback("Signup successful. You can now sign in.");
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    loadingSignup.value = false;
  }
}

async function handleSignin() {
  clearFeedback();
  loadingSignin.value = true;

  try {
    const result = await signInWithEmail({
      email: email.value,
      password: password.value,
    });

    saveSession(result.token);

    await router.push("/app");
  } catch (err) {
    setErrorFeedback(getErrorMessage(err));
  } finally {
    loadingSignin.value = false;
  }
}

onMounted(async () => {
  if (isAuthenticated.value) {
    await router.push("/app");
  }
});
</script>

<template>
  <FeedbackMessage
    v-if="message"
    type="success"
    :message="message"
  />

  <FeedbackMessage
    v-if="error"
    type="error"
    :message="error"
  />

  <AppMainGrid>
    <template #sidebar>
      <AuthCard
        v-model:auth-view="authView"
        v-model:email="email"
        v-model:password="password"
        v-model:signup-name="signupName"
        v-model:signup-email="signupEmail"
        v-model:signup-password="signupPassword"
        v-model:signup-birthdate="signupBirthdate"
        :loading-signin="loadingSignin"
        :loading-signup="loadingSignup"
        @signin="handleSignin"
        @signup="handleSignup"
      />
    </template>

    <template #content>
      <WelcomeCard />
    </template>
  </AppMainGrid>
</template>