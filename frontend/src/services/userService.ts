import { mockDatabase } from "../data/mockDatabase";
import type { User } from "../types/user";

import {
  consumeSimulatedFailure,
  simulateDelay,
} from "./mockApi";

export async function getUsers(): Promise<User[]> {
  await simulateDelay();

  if (consumeSimulatedFailure()) {
    throw new Error("Unable to load users.");
  }

  return mockDatabase.users.map((user) => ({
    ...user,
  }));
}