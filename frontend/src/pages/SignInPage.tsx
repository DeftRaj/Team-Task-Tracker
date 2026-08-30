import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../features/auth/useAuth";
import {
  validateSignIn,
  type SignInErrors,
} from "../features/auth/auth.validation";

export function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [errors, setErrors] =
    useState<SignInErrors>({});

  const [authError, setAuthError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationErrors =
      validateSignIn(email, password);

    setErrors(validationErrors);
    setAuthError("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      await signIn({
        email: email.trim(),
        password,
      });

      navigate("/dashboard");
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Sign in</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email
                ? "email-error"
                : undefined
            }
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

          {errors.email && (
            <p id="email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="current-password"
            value={password}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password
                ? "password-error"
                : undefined
            }
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

          {errors.password && (
            <p id="password-error">
              {errors.password}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              setShowPassword((current) => !current)
            }
          >
            {showPassword
              ? "Hide password"
              : "Show password"}
          </button>
        </div>

        {authError && (
          <p role="alert">
            {authError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Signing in..."
            : "Sign in"}
        </button>
      </form>
    </main>
  );
}