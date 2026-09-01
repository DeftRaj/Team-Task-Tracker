import {
  describe,
  expect,
  it,
} from "vitest";

import {
  taskToFormValues,
  validateTaskForm,
  type TaskFormValues,
} from "./taskForm.validation";

import type { Task } from "../../types/task";

const validValues: TaskFormValues = {
  title: "Build task management",
  description: "Implement CRUD workflows.",
  status: "TODO",
  priority: "MEDIUM",
  assigneeId: "user-1",
  dueDate: "2026-09-15",
};

describe("validateTaskForm", () => {
  it("accepts a valid task", () => {
    expect(
      validateTaskForm(validValues),
    ).toEqual({});
  });

  it("requires a title", () => {
    const errors = validateTaskForm({
      ...validValues,
      title: "   ",
    });

    expect(errors.title).toBe(
      "Task title is required.",
    );
  });

  it("requires an assignee", () => {
    const errors = validateTaskForm({
      ...validValues,
      assigneeId: "",
    });

    expect(errors.assigneeId).toBe(
      "Select an assignee.",
    );
  });

  it("requires a due date", () => {
    const errors = validateTaskForm({
      ...validValues,
      dueDate: "",
    });

    expect(errors.dueDate).toBe(
      "Due date is required.",
    );
  });
});

describe("taskToFormValues", () => {
  it("converts a task into editable form values", () => {
    const task: Task = {
      id: "task-1",
      projectId: "project-1",
      title: "Existing task",
      description: "Existing description",
      status: "IN_PROGRESS",
      priority: "HIGH",
      assigneeId: "user-2",
      dueDate: "2026-09-20T00:00:00.000Z",
      createdAt: "2026-09-01T00:00:00.000Z",
      updatedAt: "2026-09-01T00:00:00.000Z",
    };

    expect(taskToFormValues(task)).toEqual({
      title: "Existing task",
      description: "Existing description",
      status: "IN_PROGRESS",
      priority: "HIGH",
      assigneeId: "user-2",
      dueDate: "2026-09-20",
    });
  });
});