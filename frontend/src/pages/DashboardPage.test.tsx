import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { DashboardPage } from "./DashboardPage";
import { getTasks } from "../services/taskService";

vi.mock("../services/taskService", () => ({
  getTasks: vi.fn(),
}));

const mockedGetTasks = vi.mocked(getTasks);

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  );
}

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

    it("retries loading tasks after a failure", async () => {
    const user = userEvent.setup();

    mockedGetTasks
      .mockRejectedValueOnce(
        new Error("Unable to load tasks."),
      )
      .mockResolvedValueOnce([
        {
          id: "task-1",
          projectId: "project-1",
          title: "Recovered task",
          description: "",
          status: "TODO",
          priority: "MEDIUM",
          assigneeId: "user-1",
          dueDate: "2026-09-05T00:00:00.000Z",
          createdAt: "2026-08-30T09:00:00.000Z",
          updatedAt: "2026-08-30T09:00:00.000Z",
        },
      ]);

    renderDashboard();

    expect(
      await screen.findByRole("alert"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Try again",
      }),
    );

    expect(
      await screen.findByText("Recovered task"),
    ).toBeInTheDocument();

    expect(mockedGetTasks).toHaveBeenCalledTimes(2);
  });

  it("shows the loading state while tasks are loading", () => {
    mockedGetTasks.mockReturnValue(
      new Promise(() => {}),
    );

    renderDashboard();

    expect(
      screen.getByRole("status", {
        name: "Loading dashboard",
      }),
      ).toBeInTheDocument();
  });

  it("shows the populated dashboard when tasks load successfully", async () => {
    mockedGetTasks.mockResolvedValue([
      {
        id: "task-1",
        projectId: "project-1",
        title: "Design dashboard",
        description: "Create dashboard UI",
        status: "IN_PROGRESS",
        priority: "HIGH",
        assigneeId: "user-1",
        dueDate: "2026-09-03T00:00:00.000Z",
        createdAt: "2026-08-25T09:00:00.000Z",
        updatedAt: "2026-08-30T09:00:00.000Z",
      },
    ]);

    renderDashboard();

    expect(
      await screen.findByText("Design dashboard"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Total tasks"),
    ).toBeInTheDocument();

    
    expect(
      screen.getByText("In Progress", {
      selector: ".badge",}),
     ).toBeInTheDocument();
  });

  it("shows the empty state when there are no tasks", async () => {
    mockedGetTasks.mockResolvedValue([]);

    renderDashboard();

    expect(
      await screen.findByText("No tasks yet"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create your first task to start tracking team work.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error state when loading tasks fails", async () => {
    mockedGetTasks.mockRejectedValue(
      new Error("Unable to load tasks."),
    );

    renderDashboard();

    expect(
      await screen.findByRole("alert"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Unable to load tasks."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Try again",
      }),
    ).toBeInTheDocument();
  });
});