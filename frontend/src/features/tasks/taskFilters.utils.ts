import type { Task } from "../../types/task";

import type {
  TaskFilters,
} from "./taskFilters.types";

export function filterAndSortTasks(
  tasks: Task[],
  filters: TaskFilters,
): Task[] {
  const normalizedSearch =
    filters.search.trim().toLowerCase();

  const filteredTasks = tasks.filter(
    (task) => {
      const matchesSearch =
        !normalizedSearch ||
        task.title
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        filters.status === "ALL" ||
        task.status === filters.status;

      const matchesPriority =
        filters.priority === "ALL" ||
        task.priority === filters.priority;

      const matchesAssignee =
        !filters.assigneeId ||
        task.assigneeId ===
          filters.assigneeId;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee
      );
    },
  );

  return [...filteredTasks].sort(
    (first, second) => {
      const firstValue =
        new Date(
          first[filters.sortBy],
        ).getTime();

      const secondValue =
        new Date(
          second[filters.sortBy],
        ).getTime();

      const difference =
        firstValue - secondValue;

      return filters.sortDirection === "asc"
        ? difference
        : -difference;
    },
  );
}