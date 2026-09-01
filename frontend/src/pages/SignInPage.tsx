import {
  useState,
  type SyntheticEvent,
} from "react";

import { useNavigate } from "react-router";

import { Button } from "../components/ui/Button";
import { useAuth } from "../features/auth/useAuth";

import {
  validateSignIn,
  type SignInErrors,
} from "../features/auth/auth.validation";

export function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

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

    if (isSubmitting) {
      return;
    }

    const validationErrors =
      validateSignIn(email, password);

    setErrors(validationErrors);
    setAuthError("");

    if (
      Object.keys(validationErrors).length > 0
    ) {
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
    <main className="sign-in-page">
      <section className="sign-in-brand">
        <div className="sign-in-brand-content">
          <div
            className="sign-in-brand-mark"
            aria-hidden="true"
          >
            TT
          </div>

          <p className="sign-in-eyebrow">
            Team Task Tracker
          </p>

          <h1>
            Keep projects moving and work
            visible.
          </h1>

          <p className="sign-in-brand-description">
            Track project progress, manage team
            tasks, and understand what needs
            attention from one focused workspace.
          </p>

          <div
            className="sign-in-feature-list"
            aria-label="Product features"
          >
            <div>
              <strong>Projects</strong>
              <span>
                See progress and team activity.
              </span>
            </div>

            <div>
              <strong>Tasks</strong>
              <span>
                Search, filter, create, and update
                work.
              </span>
            </div>

            <div>
              <strong>Dashboard</strong>
              <span>
                Understand progress at a glance.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="sign-in-panel">
        <div className="sign-in-card">
          <header className="sign-in-header">
            <div className="sign-in-mobile-brand">
              <div
                className="sign-in-brand-mark"
                aria-hidden="true"
              >
                TT
              </div>

              <span>Team Task Tracker</span>
            </div>

            <p className="sign-in-kicker">
              Welcome back
            </p>

            <h2>Sign in to your workspace</h2>

            <p>
              Enter your demo account details to
              continue.
            </p>
          </header>

          <form
            className="sign-in-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                disabled={isSubmitting}
                aria-invalid={Boolean(
                  errors.email,
                )}
                aria-describedby={
                  errors.email
                    ? "email-error"
                    : undefined
                }
                onChange={(event) => {
                  setEmail(
                    event.target.value,
                  );

                  if (errors.email) {
                    setErrors((current) => ({
                      ...current,
                      email: undefined,
                    }));
                  }
                }}
              />

              {errors.email && (
                <p
                  id="email-error"
                  className="field-error"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(
                    errors.password,
                  )}
                  aria-describedby={
                    errors.password
                      ? "password-error"
                      : undefined
                  }
                  onChange={(event) => {
                    setPassword(
                      event.target.value,
                    );

                    if (errors.password) {
                      setErrors(
                        (current) => ({
                          ...current,
                          password: undefined,
                        }),
                      );
                    }
                  }}
                />

                <button
                  type="button"
                  className="password-toggle"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-pressed={showPassword}
                  disabled={isSubmitting}
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  className="field-error"
                  role="alert"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {authError && (
              <div
                className="sign-in-error"
                role="alert"
              >
                <strong>
                  Sign-in failed
                </strong>

                <span>{authError}</span>
              </div>
            )}

            <Button
              type="submit"
              className="sign-in-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Signing in..."
                : "Sign in"}
            </Button>
          </form>

          <footer className="sign-in-footer">
            <p>
              Demo credentials are listed in the
              project README.
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}