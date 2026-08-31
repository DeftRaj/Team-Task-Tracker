import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "./AppShell";

vi.mock("../../features/auth/useAuth", () => ({
  useAuth: () => ({
    user: {
      name: "Demo User",
    },
    logout: vi.fn(),
  }),
}));

describe("AppShell", () => {
  it("renders the application navigation", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppShell>
          <h1>Dashboard</h1>
        </AppShell>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("navigation", {
        name: "Main navigation",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Dashboard",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Projects",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Logout",
      }),
    ).toBeInTheDocument();
  });
});