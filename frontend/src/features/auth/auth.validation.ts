export interface SignInErrors {
  email?: string;
  password?: string;
}

export function validateSignIn(
  email: string,
  password: string,
): SignInErrors {
  const errors: SignInErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
}