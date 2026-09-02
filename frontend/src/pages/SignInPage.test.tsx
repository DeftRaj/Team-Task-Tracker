import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SignInPage } from "./SignInPage";
import { AuthProvider } from "../features/auth/AuthProvider";
import { authService } from "../services/authService";

vi.mock("../services/authService", () => ({
  authService: {
    signIn: vi.fn(),
    getSession: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockedAuthService = vi.mocked(authService);

function renderSignInPage() {
  return render(
    <MemoryRouter initialEntries={["/sign-in"]}>
      <AuthProvider>
        <SignInPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAuthService.getSession.mockReturnValue(null);
  });

  it("shows required-field validation errors and does not attempt to sign in", async () => {
    const user = userEvent.setup();

    renderSignInPage();

    await user.click(
      screen.getByRole("button", { name: "Sign in" }),
    );

    expect(
      await screen.findByText("Email is required."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Password is required."),
    ).toBeInTheDocument();

    expect(mockedAuthService.signIn).not.toHaveBeenCalled();
  });

  it("shows a validation error for an invalid email format", async () => {
    const user = userEvent.setup();

    renderSignInPage();

    await user.type(
      screen.getByLabelText("Email"),
      "not-an-email",
    );

    await user.type(
      screen.getByLabelText("Password"),
      "Demo@123",
    );

    await user.click(
      screen.getByRole("button", { name: "Sign in" }),
    );

    expect(
      await screen.findByText("Enter a valid email address."),
    ).toBeInTheDocument();

    expect(mockedAuthService.signIn).not.toHaveBeenCalled();
  });

  it("toggles the password field between hidden and visible text", async () => {
    const user = userEvent.setup();

    renderSignInPage();

    const passwordInput = screen.getByLabelText("Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", { name: "Show password" }),
    );

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(
      screen.getByRole("button", { name: "Hide password" }),
    );

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("shows a clear error message when sign-in fails", async () => {
    const user = userEvent.setup();

    mockedAuthService.signIn.mockRejectedValueOnce(
      new Error("Invalid email or password."),
    );

    renderSignInPage();

    await user.type(
      screen.getByLabelText("Email"),
      "demo@tasktracker.com",
    );

    await user.type(
      screen.getByLabelText("Password"),
      "wrong-password",
    );

    await user.click(
      screen.getByRole("button", { name: "Sign in" }),
    );

    expect(
      await screen.findByText("Invalid email or password."),
    ).toBeInTheDocument();

    expect(mockedAuthService.signIn).toHaveBeenCalledWith({
      email: "demo@tasktracker.com",
      password: "wrong-password",
    });
  });

  it("disables the submit button while sign-in is in progress", async () => {
    const user = userEvent.setup();

    let resolveSignIn: () => void = () => {};

    mockedAuthService.signIn.mockReturnValue(
      new Promise((resolve) => {
        resolveSignIn = () =>
          resolve({
            user: {
              id: "user-1",
              name: "Demo User",
              email: "demo@tasktracker.com",
            },
          });
      }),
    );

    renderSignInPage();

    await user.type(
      screen.getByLabelText("Email"),
      "demo@tasktracker.com",
    );

    await user.type(
      screen.getByLabelText("Password"),
      "Demo@123",
    );

    await user.click(
      screen.getByRole("button", { name: "Sign in" }),
    );

    expect(
      await screen.findByRole("button", { name: "Signing in..." }),
    ).toBeDisabled();

    resolveSignIn();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Sign in" }),
      ).not.toBeDisabled();
    });
  });
});