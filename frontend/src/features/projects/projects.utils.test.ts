import {
  describe,
  expect,
  it,
} from "vitest";

import type { Project } from "../../types/project";
import type { Task } from "../../types/task";

import {
  getProjectSummary,
  getProjectSummaries,
  searchProjects,
} from "./projects.utils";

const projects: Project[] = [
  {
    id: "project-1",
    name: "Website Redesign",
    description: "Redesign website",
    memberIds: [
      "user-1",
      "user-2",
      "user-3",
    ],
    createdAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "project-2",
    name: "Mobile App",
    description: "Build mobile app",
    memberIds: [
      "user-1",
      "user-4",
    ],
    createdAt: "2026-08-02T00:00:00.000Z",
  },
];

const tasks: Task[] = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Task 1",
    description: "",
    status: "DONE",
    priority: "HIGH",
    assigneeId: "user-1",
    dueDate: "2026-09-01T00:00:00.000Z",
    createdAt: "2026-08-20T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z",
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Task 2",
    description: "",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    assigneeId: "user-2",
    dueDate: "2026-09-02T00:00:00.000Z",
    createdAt: "2026-08-21T00:00:00.000Z",
    updatedAt: "2026-08-21T00:00:00.000Z",
  },
  {
    id: "task-3",
    projectId: "project-2",
    title: "Task 3",
    description: "",
    status: "DONE",
    priority: "LOW",
    assigneeId: "user-4",
    dueDate: "2026-09-03T00:00:00.000Z",
    createdAt: "2026-08-22T00:00:00.000Z",
    updatedAt: "2026-08-22T00:00:00.000Z",
  },
];

describe("getProjectSummary", () => {
  it("calculates project task and member information", () => {
    const summary = getProjectSummary(
      projects[0],
      tasks,
    );

    expect(summary.taskCount).toBe(2);
    expect(summary.memberCount).toBe(3);
    expect(summary.progressPercentage).toBe(50);
  });

  it("returns zero progress for a project without tasks", () => {
    const project: Project = {
      id: "project-empty",
      name: "Empty Project",
      description: "",
      memberIds: [],
      createdAt: "2026-08-01T00:00:00.000Z",
    };

    const summary = getProjectSummary(
      project,
      tasks,
    );

    expect(summary.taskCount).toBe(0);
    expect(summary.progressPercentage).toBe(0);
  });
});

describe("getProjectSummaries", () => {
  it("creates summaries for all projects", () => {
    const summaries = getProjectSummaries(
      projects,
      tasks,
    );

    expect(summaries).toHaveLength(2);
    expect(summaries[0].progressPercentage).toBe(
      50,
    );
    expect(summaries[1].progressPercentage).toBe(
      100,
    );
  });
});

describe("searchProjects", () => {
  const summaries = getProjectSummaries(
    projects,
    tasks,
  );

  it("returns all projects when search is empty", () => {
    expect(
      searchProjects(summaries, ""),
    ).toHaveLength(2);
  });

  it("matches project names case-insensitively", () => {
    const result = searchProjects(
      summaries,
      "WEBSITE",
    );

    expect(result).toHaveLength(1);
    expect(
      result[0].project.name,
    ).toBe("Website Redesign");
  });

  it("returns no projects when there is no match", () => {
    const result = searchProjects(
      summaries,
      "xyz123",
    );

    expect(result).toHaveLength(0);
  });
});