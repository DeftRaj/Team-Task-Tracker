import type { Project } from "../../types/project";
import type { Task } from "../../types/task";

export interface ProjectSummary {
  project: Project;
  taskCount: number;
  memberCount: number;
  progressPercentage: number;
}

export function getProjectSummary(
  project: Project,
  tasks: Task[],
): ProjectSummary {
  const projectTasks = tasks.filter(
    (task) => task.projectId === project.id,
  );

  const completedTasks = projectTasks.filter(
    (task) => task.status === "DONE",
  ).length;

  const progressPercentage =
    projectTasks.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            projectTasks.length) *
            100,
        );

  return {
    project,
    taskCount: projectTasks.length,
    memberCount: project.memberIds.length,
    progressPercentage,
  };
}

export function getProjectSummaries(
  projects: Project[],
  tasks: Task[],
): ProjectSummary[] {
  return projects.map((project) =>
    getProjectSummary(project, tasks),
  );
}

export function searchProjects(
  projects: ProjectSummary[],
  searchTerm: string,
): ProjectSummary[] {
  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return projects;
  }

  return projects.filter(
    ({ project }) =>
      project.name
        .toLowerCase()
        .includes(normalizedSearch),
  );
}