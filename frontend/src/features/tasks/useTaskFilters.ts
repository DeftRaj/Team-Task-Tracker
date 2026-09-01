import {
  useMemo,
  useState,
} from "react";

import type { Task } from "../../types/task";

import {
  DEFAULT_TASK_FILTERS,
} from "./taskFilters.constants";

import {
  filterAndSortTasks,
} from "./taskFilters.utils";

export function useTaskFilters(
  tasks: Task[],
) {
  const [filters, setFilters] =
    useState(DEFAULT_TASK_FILTERS);

  const visibleTasks = useMemo(
    () =>
      filterAndSortTasks(
        tasks,
        filters,
      ),
    [tasks, filters],
  );

  function updateFilters(
    changes: Partial<
      typeof DEFAULT_TASK_FILTERS
    >,
  ) {
    setFilters((current) => ({
      ...current,
      ...changes,
    }));
  }

  function resetFilters() {
    setFilters(DEFAULT_TASK_FILTERS);
  }

  return {
    filters,
    visibleTasks,
    updateFilters,
    resetFilters,
  };
}