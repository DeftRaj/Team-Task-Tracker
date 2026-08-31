import { seedTasks } from "../data/seed/tasks";
import type { Task } from "../types/task";
import {
  consumeSimulatedFailure,
  simulateDelay,
} from "./mockApi";

export async function getTasks(): Promise<Task[]> {
  await simulateDelay();

  if (consumeSimulatedFailure()) {
    throw new Error("Unable to load tasks.");
  }

  return [...seedTasks];
}