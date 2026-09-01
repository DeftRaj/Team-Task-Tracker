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
      (task) =>
        task.projectId === projectId,
    )
    .map(cloneTask);
}

export async function createTask(
  task: Task,
): Promise<Task> {
  await simulateDelay();

  if (consumeSimulatedFailure()) {
    throw new Error(
      "Unable to create task.",
    );
  }

  mockDatabase.tasks.push({
    ...task,
  });

  return cloneTask(task);
}

export async function updateTask(
  taskId: string,
  changes: Partial<Task>,
): Promise<Task> {
  await simulateDelay();

  if (consumeSimulatedFailure()) {
    throw new Error(
      "Unable to update task.",
    );
  }

  const taskIndex =
    mockDatabase.tasks.findIndex(
      (task) => task.id === taskId,
    );

  if (taskIndex === -1) {
    throw new Error(
      "Task could not be found.",
    );
  }

  const updatedTask = {
    ...mockDatabase.tasks[taskIndex],
    ...changes,
    updatedAt: new Date().toISOString(),
  };

  mockDatabase.tasks[taskIndex] =
    updatedTask;

  return cloneTask(updatedTask);
}

export async function deleteTask(
  taskId: string,
): Promise<void> {
  await simulateDelay();

  if (consumeSimulatedFailure()) {
    throw new Error(
      "Unable to delete task.",
    );
  }

  const taskIndex =
    mockDatabase.tasks.findIndex(
      (task) => task.id === taskId,
    );

  if (taskIndex === -1) {
    throw new Error(
      "Task could not be found.",
    );
  }

  mockDatabase.tasks.splice(
    taskIndex,
    1,
  );
}