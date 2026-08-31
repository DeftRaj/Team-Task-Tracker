import { mockDatabase } from "../data/mockDatabase";
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

  return mockDatabase.tasks.map((task) => ({
    ...task,
  }));
}