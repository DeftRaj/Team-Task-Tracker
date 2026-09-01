import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  simulateNextRequestFailure,
} from "./mockApi";

import { mockDatabase } from "../data/mockDatabase";
import { seedTasks } from "../data/seed/tasks";

import {
  createTask,
  deleteTask,
  getTasksByProjectId,
  updateTask,
} from "./taskService";

import type { Task } from "../types/task";

beforeEach(() => {
  mockDatabase.tasks = seedTasks.map(
    (task) => ({
      ...task,
    }),
  );
});

describe("taskService", () => {
  it("returns tasks for a project", async () => {
    const tasks =
      await getTasksByProjectId(
        "project-1",
      );

    expect(
      tasks.every(
        (task) =>
          task.projectId === "project-1",
      ),
    ).toBe(true);
  });

  it("creates a task", async () => {
    const newTask: Task = {
      id: "test-task",
      projectId: "project-1",
      title: "Test task",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      assigneeId: "user-1",
      dueDate:
        "2026-09-20T00:00:00.000Z",
      createdAt:
        "2026-09-01T00:00:00.000Z",
      updatedAt:
        "2026-09-01T00:00:00.000Z",
    };

    const result =
      await createTask(newTask);

    expect(result.id).toBe("test-task");

    expect(
      mockDatabase.tasks.some(
        (task) =>
          task.id === "test-task",
      ),
    ).toBe(true);
  });

  it("updates a task", async () => {
    const existing =
      mockDatabase.tasks[0];

    const result = await updateTask(
      existing.id,
      {
        status: "DONE",
      },
    );

    expect(result.status).toBe("DONE");
  });

  it("deletes a task", async () => {
    const existing =
      mockDatabase.tasks[0];

    await deleteTask(existing.id);

    expect(
      mockDatabase.tasks.some(
        (task) =>
          task.id === existing.id,
      ),
    ).toBe(false);
  });

  it("surfaces create-task service failure", async () => {
  simulateNextRequestFailure();

  const task: Task = {
    id: "failed-task",
    projectId: "project-1",
    title: "Failed task",
    description: "",
    status: "TODO",
    priority: "LOW",
    assigneeId: "user-1",
    dueDate:
      "2026-09-20T00:00:00.000Z",
    createdAt:
      "2026-09-01T00:00:00.000Z",
    updatedAt:
      "2026-09-01T00:00:00.000Z",
  };

  await expect(
    createTask(task),
  ).rejects.toThrow(
    "Unable to create task.",
  );
});
});