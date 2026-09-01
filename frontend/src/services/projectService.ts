import { mockDatabase } from "../data/mockDatabase";
import type { Project } from "../types/project";

import {
  consumeSimulatedFailure,
  simulateDelay,
} from "./mockApi";

export async function getProjects(): Promise<Project[]> {
  await simulateDelay();

  if (consumeSimulatedFailure()) {
    throw new Error("Unable to load projects.");
  }

  return mockDatabase.projects.map((project) => ({
    ...project,
    memberIds: [...project.memberIds],
  }));
}

export async function getProjectById(
  projectId: string,
): Promise<Project | null> {
  await simulateDelay();

  if (consumeSimulatedFailure()) {
    throw new Error("Unable to load project.");
  }

  const project = mockDatabase.projects.find(
    (item) => item.id === projectId,
  );

  if (!project) {
    return null;
  }

  return {
    ...project,
    memberIds: [...project.memberIds],
  };
}

export async function createProject(
  project: Project,
): Promise<Project> {
  await simulateDelay();

  if (consumeSimulatedFailure()) {
    throw new Error("Unable to create project.");
  }

  mockDatabase.projects.push({
    ...project,
    memberIds: [...project.memberIds],
  });

  return {
    ...project,
    memberIds: [...project.memberIds],
  };
}