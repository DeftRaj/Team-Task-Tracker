import {
  describe,
  expect,
  it,
} from "vitest";

import type { Task } from "../../types/task";

import {
  filterAndSortTasks,
} from "./taskFilters.utils";

const tasks: Task[] = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Design dashboard",
    description: "",
    status: "TODO",
    priority: "HIGH",
    assigneeId: "user-1",
    dueDate: "2026-09-05T00:00:00.000Z",
    createdAt: "2026-08-20T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z",
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Build navigation",
    description: "",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    assigneeId: "user-2",
    dueDate: "2026-09-02T00:00:00.000Z",
    createdAt: "2026-08-22T00:00:00.000Z",
    updatedAt: "2026-08-22T00:00:00.000Z",
  },
  {
    id: "task-3",
    projectId: "project-1",
    title: "Fix dashboard",
    description: "",
    status: "DONE",
    priority: "HIGH",
    assigneeId: "user-1",
    dueDate: "2026-08-30T00:00:00.000Z",
    createdAt: "2026-08-25T00:00:00.000Z",
    updatedAt: "2026-08-25T00:00:00.000Z",
  },
];

describe("filterAndSortTasks", () => {
  it("returns all tasks when no filters are applied", () => {
    const result = filterAndSortTasks(
      tasks,
      {
        search: "",
        status: "ALL",
        priority: "ALL",
        assigneeId: "",
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    );

    expect(result).toHaveLength(3);
  });

  it("searches task titles case-insensitively", () => {
    const result = filterAndSortTasks(
      tasks,
      {
        search: "DASHBOARD",
        status: "ALL",
        priority: "ALL",
        assigneeId: "",
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    );

    expect(result).toHaveLength(2);
    expect(
      result.map((task) => task.id),
    ).toEqual(["task-3", "task-1"]);
  });

  it("filters by status", () => {
    const result = filterAndSortTasks(
      tasks,
      {
        search: "",
        status: "IN_PROGRESS",
        priority: "ALL",
        assigneeId: "",
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("task-2");
  });

  it("filters by priority", () => {
    const result = filterAndSortTasks(
      tasks,
      {
        search: "",
        status: "ALL",
        priority: "HIGH",
        assigneeId: "",
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    );

    expect(result).toHaveLength(2);
  });

  it("filters by assignee", () => {
    const result = filterAndSortTasks(
      tasks,
      {
        search: "",
        status: "ALL",
        priority: "ALL",
        assigneeId: "user-2",
        sortBy: "createdAt",
        sortDirection: "desc",
      },
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("task-2");
  });

  it("sorts by due date ascending", () => {
    const result = filterAndSortTasks(
      tasks,
      {
        search: "",
        status: "ALL",
        priority: "ALL",
        assigneeId: "",
        sortBy: "dueDate",
        sortDirection: "asc",
      },
    );

    expect(
      result.map((task) => task.id),
    ).toEqual([
      "task-3",
      "task-2",
      "task-1",
    ]);
  });
});