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

import { DeleteTaskDialog } from "./DeleteTaskDialog";

import type { Task } from "../../types/task";

const task: Task = {
  id: "task-1",
  projectId: "project-1",
  title: "Delete me",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  assigneeId: "user-1",
  dueDate: "2026-09-20T00:00:00.000Z",
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
};

describe("DeleteTaskDialog", () => {
  it("asks for confirmation before deletion", () => {
    render(
      <DeleteTaskDialog
        task={task}
        isDeleting={false}
        error={null}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("dialog"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Are you sure you want to delete/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "This action cannot be undone.",
      ),
    ).toBeInTheDocument();
  });

  it("calls the delete confirmation handler", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <DeleteTaskDialog
        task={task}
        isDeleting={false}
        error={null}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete task",
      }),
    );

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("allows deletion to be cancelled", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <DeleteTaskDialog
        task={task}
        isDeleting={false}
        error={null}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("closes the dialog when Escape is pressed", async () => {
  const user = userEvent.setup();
  const onCancel = vi.fn();

  render(
    <DeleteTaskDialog
      task={task}
      isDeleting={false}
      error={null}
      onConfirm={vi.fn()}
      onCancel={onCancel}
    />,
  );

  await user.keyboard("{Escape}");

  expect(onCancel).toHaveBeenCalledOnce();
});

});