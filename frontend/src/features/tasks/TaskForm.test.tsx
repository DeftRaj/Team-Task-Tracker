import {
  render,
  screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { TaskForm } from "./TaskForm";

const initialValues = {
  title: "",
  description: "",
  status: "TODO" as const,
  priority: "MEDIUM" as const,
  assigneeId: "",
  dueDate: "",
};

const users = [
  {
    id: "user-1",
    name: "Aarav Sharma",
  },
  {
    id: "user-2",
    name: "Priya Mehta",
  },
];

describe("TaskForm", () => {
  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <TaskForm
        initialValues={initialValues}
        users={users}
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Save task",
      }),
    );

    expect(
      screen.getByText(
        "Task title is required.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Select an assignee.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Due date is required.",
      ),
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid task values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(
      undefined,
    );

    render(
      <TaskForm
        initialValues={initialValues}
        users={users}
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(
      screen.getByLabelText("Title"),
      "Implement task modal",
    );

    await user.selectOptions(
      screen.getByLabelText("Assignee"),
      "user-1",
    );

    await user.type(
      screen.getByLabelText("Due date"),
      "2026-09-20",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Save task",
      }),
    );

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Implement task modal",
        assigneeId: "user-1",
        dueDate: "2026-09-20",
      }),
    );
  });

  it("prevents duplicate submissions while saving", () => {
    render(
      <TaskForm
        initialValues={initialValues}
        users={users}
        isSubmitting={true}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Saving...",
      }),
    ).toBeDisabled();
  });
});