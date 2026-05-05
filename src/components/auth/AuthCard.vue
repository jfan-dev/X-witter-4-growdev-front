<script setup lang="ts">
type AuthView = "signin" | "signup";

defineProps<{
  authView: AuthView;
  email: string;
  password: string;
  signupName: string;
  signupEmail: string;
  signupPassword: string;
  signupBirthdate: string;
  loadingSignin: boolean;
  loadingSignup: boolean;
}>();

const emit = defineEmits<{
  (event: "update:authView", value: AuthView): void;
  (event: "update:email", value: string): void;
  (event: "update:password", value: string): void;
  (event: "update:signupName", value: string): void;
  (event: "update:signupEmail", value: string): void;
  (event: "update:signupPassword", value: string): void;
  (event: "update:signupBirthdate", value: string): void;
  (event: "signin"): void;
  (event: "signup"): void;
}>();

function getInputValue(event: Event) {
  const target = event.target as HTMLInputElement | null;
  return target?.value ?? "";
}
</script>

<template>
  <section class="card auth-card">
    <div class="auth-header">
      <div>
        <p class="section-kicker">Access</p>

        <h2>
          {{ authView === "signin" ? "Welcome back" : "Create your account" }}
        </h2>
      </div>

      <div class="auth-tabs" aria-label="Authentication options">
        <button
          type="button"
          class="auth-tab"
          :class="{ 'auth-tab-active': authView === 'signin' }"
          @click="emit('update:authView', 'signin')"
        >
          Sign in
        </button>

        <button
          type="button"
          class="auth-tab"
          :class="{ 'auth-tab-active': authView === 'signup' }"
          @click="emit('update:authView', 'signup')"
        >
          Sign up
        </button>
      </div>
    </div>

    <form
      v-if="authView === 'signin'"
      class="form-grid"
      @submit.prevent="emit('signin')"
    >
      <input
        :value="email"
        class="field"
        type="email"
        placeholder="Email"
        @input="emit('update:email', getInputValue($event))"
      />

      <input
        :value="password"
        class="field"
        type="password"
        placeholder="Password"
        @input="emit('update:password', getInputValue($event))"
      />

      <button
        type="submit"
        class="button button-primary"
        :disabled="loadingSignin"
      >
        {{ loadingSignin ? "Signing in..." : "Sign in" }}
      </button>
    </form>

    <form
      v-else
      class="form-grid"
      @submit.prevent="emit('signup')"
    >
      <input
        :value="signupName"
        class="field"
        type="text"
        placeholder="Name"
        @input="emit('update:signupName', getInputValue($event))"
      />

      <input
        :value="signupEmail"
        class="field"
        type="email"
        placeholder="Email"
        @input="emit('update:signupEmail', getInputValue($event))"
      />

      <input
        :value="signupPassword"
        class="field"
        type="password"
        placeholder="Password"
        @input="emit('update:signupPassword', getInputValue($event))"
      />

      <input
        :value="signupBirthdate"
        class="field"
        type="date"
        @input="emit('update:signupBirthdate', getInputValue($event))"
      />

      <button
        type="submit"
        class="button button-primary"
        :disabled="loadingSignup"
      >
        {{ loadingSignup ? "Creating account..." : "Create account" }}
      </button>
    </form>

    <p class="auth-helper">
      {{
        authView === "signin"
          ? "Sign in to unlock your feed, likes, replies, follows, and profile actions."
          : "After signup, you will be moved back to the signin form."
      }}
    </p>
  </section>
</template>