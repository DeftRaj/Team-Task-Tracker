import { describe, expect, it } from "vitest";

import {
  getDashboardStats,
  getRecentTasks,
} from "./dashboard.utils";

import type { Task } from "../../types/task";

const testTasks: Task[] = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Task One",
    description: "",
    status: "TODO",
    priority: "HIGH",
    assigneeId: "user-1",
    dueDate: "2026-08-30T00:00:00.000Z",
    createdAt: "2026-08-20T09:00:00.000Z",
    updatedAt: "2026-08-25T09:00:00.000Z",
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Task Two",
    description: "",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    assigneeId: "user-2",
    dueDate: "2026-09-02T00:00:00.000Z",
    createdAt: "2026-08-21T09:00:00.000Z",
    updatedAt: "2026-08-28T09:00:00.000Z",
  },
  {
    id: "task-3",
    projectId: "project-2",
    title: "Task Three",
    description: "",
    status: "DONE",
    priority: "LOW",
    assigneeId: "user-3",
    dueDate: "2026-08-27T00:00:00.000Z",
    createdAt: "2026-08-22T09:00:00.000Z",
    updatedAt: "2026-08-29T09:00:00.000Z",
  },
  {
    id: "task-4",
    projectId: "project-2",
    title: "Task Four",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    assigneeId: "user-4",
    dueDate: "2026-09-10T00:00:00.000Z",
    createdAt: "2026-08-23T09:00:00.000Z",
    updatedAt: "2026-08-27T09:00:00.000Z",
  },
];

describe("getDashboardStats", () => {
  const now = new Date("2026-08-31T10:00:00.000Z");

  it("calculates task counts correctly", () => {
    const stats = getDashboardStats(
      testTasks,
      now,
    );

    expect(stats.total).toBe(4);
    expect(stats.todo).toBe(2);
    expect(stats.inProgress).toBe(1);
    expect(stats.done).toBe(1);
  });

  it("counts unfinished overdue tasks", () => {
    const stats = getDashboardStats(
      testTasks,
      now,
    );

    expect(stats.overdue).toBe(1);
  });

  it("counts unfinished tasks due within seven days", () => {
    const stats = getDashboardStats(
      testTasks,
      now,
    );

    expect(stats.dueSoon).toBe(1);
  });

  it("calculates completion percentage", () => {
    const stats = getDashboardStats(
      testTasks,
      now,
    );

    expect(stats.completionPercentage).toBe(25);
  });

  it("returns zero percent when there are no tasks", () => {
    const stats = getDashboardStats([], now);

    expect(stats.completionPercentage).toBe(0);
  });
});

describe("getRecentTasks", () => {
  it("returns tasks ordered by most recently updated", () => {
    const recentTasks = getRecentTasks(testTasks);

    expect(recentTasks.map((task) => task.id)).toEqual([
      "task-3",
      "task-2",
      "task-4",
      "task-1",
    ]);
  });

  it("respects the requested limit", () => {
    const recentTasks = getRecentTasks(
      testTasks,
      2,
    );

    expect(recentTasks).toHaveLength(2);
    expect(recentTasks.map((task) => task.id)).toEqual([
      "task-3",
      "task-2",
    ]);
  });
});