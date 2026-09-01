import { mockDatabase } from "../data/mockDatabase";
import type { Task } from "../types/task";

import {
  consumeSimulatedFailure,
  simulateDelay,
} from "./mockApi";

function cloneTask(task: Task): Task {
  return {
    ...task,
  };
}

export async function getTasks(): Promise<Task[]> {
  await simulateDelay();

  if (consumeSimulatedFailure()) {
    throw new Error("Unable to load tasks.");
  }

  return mockDatabase.tasks.map(cloneTask);
}

export async function getTasksByProjectId(
  projectId: string,
): Promise<Task[]> {
  await simulateDelay();

  if (consumeSimulatedFailure()) {
    throw new Error(
      "Unable to load project tasks.",
    );
  }

  return mockDatabase.tasks
    .filter(
      (task) => task.projectId === projectId,
    )
    .map(cloneTask);
}