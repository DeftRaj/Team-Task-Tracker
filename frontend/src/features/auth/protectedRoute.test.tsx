import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SignInPage } from "../../pages/SignInPage";
import { ProtectedLayout } from "../../components/layout/ProtectedLayout";
import { AuthProvider } from "./AuthProvider";
import { authService } from "../../services/authService";
import type { AuthSession } from "./auth.types";

vi.mock("../../services/authService", () => ({
  authService: {
    signIn: vi.fn(),
    getSession: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockedAuthService = vi.mocked(authService);

const demoSession: AuthSession = {
  user: {
    id: "user-1",
    name: "Demo User",
    email: "demo@tasktracker.com",
  },
};

function renderApp(initialEntry: string) {
  const router = createMemoryRouter(
    [
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/dashboard",
            element: <h1>Dashboard content</h1>,
          },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  );

  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  );
}

describe("Protected route behaviour", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects an unauthenticated visitor away from a protected route to sign-in", () => {
    mockedAuthService.getSession.mockReturnValue(null);

    renderApp("/dashboard");

    expect(
      screen.getByRole("heading", {
        name: "Sign in to your workspace",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Dashboard content"),
    ).not.toBeInTheDocument();
  });

  it("lets an already-authenticated user land directly on a protected route", () => {
    mockedAuthService.getSession.mockReturnValue(demoSession);

    renderApp("/dashboard");

    expect(
      screen.getByText("Dashboard content"),
    ).toBeInTheDocument();
  });

  it("signs in successfully and grants access to the protected route", async () => {
    const user = userEvent.setup();

    mockedAuthService.getSession.mockReturnValue(null);
    mockedAuthService.signIn.mockResolvedValueOnce(demoSession);

    renderApp("/dashboard");

    expect(
      screen.getByRole("heading", {
        name: "Sign in to your workspace",
      }),
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText("Email"),
      demoSession.user.email,
    );

    await user.type(
      screen.getByLabelText("Password"),
      "Demo@123",
    );

    await user.click(
      screen.getByRole("button", { name: "Sign in" }),
    );

    expect(
      await screen.findByText("Dashboard content"),
    ).toBeInTheDocument();

    expect(mockedAuthService.signIn).toHaveBeenCalledWith({
      email: demoSession.user.email,
      password: "Demo@123",
    });
  });
});