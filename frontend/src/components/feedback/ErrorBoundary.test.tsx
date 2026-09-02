import {
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { ErrorBoundary } from "./ErrorBoundary";

function BrokenComponent(): never {
  throw new Error(
    "Test rendering failure",
  );
}

describe("ErrorBoundary", () => {
  it("shows a fallback when a child throws", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>,
      );

      expect(
        screen.getByRole("alert"),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Something went wrong",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "Reload application",
        }),
      ).toBeInTheDocument();
    } finally {
      consoleError.mockRestore();
    }
  });
});