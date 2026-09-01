import { useMemo } from "react";
import { useSearchParams } from "react-router";

import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "../../types/task";

import {
  filterAndSortTasks,
} from "./taskFilters.utils";

import type {
  TaskFilters,
  TaskSortDirection,
  TaskSortField,
} from "./taskFilters.types";

const statuses: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
];

const priorities: TaskPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

const sortFields: TaskSortField[] = [
  "dueDate",
  "createdAt",
];

const sortDirections: TaskSortDirection[] = [
  "asc",
  "desc",
];

function parseFilters(
  searchParams: URLSearchParams,
): TaskFilters {
  const rawStatus =
    searchParams.get("status");

  const rawPriority =
    searchParams.get("priority");

  const rawSort =
    searchParams.get("sort");

  const rawOrder =
    searchParams.get("order");

  return {
    search:
      searchParams.get("search") ?? "",

    status:
      rawStatus &&
      statuses.includes(
        rawStatus as TaskStatus,
      )
        ? (rawStatus as TaskStatus)
        : "ALL",

    priority:
      rawPriority &&
      priorities.includes(
        rawPriority as TaskPriority,
      )
        ? (rawPriority as TaskPriority)
        : "ALL",

    assigneeId:
      searchParams.get("assignee") ?? "",

    sortBy:
      rawSort &&
      sortFields.includes(
        rawSort as TaskSortField,
      )
        ? (rawSort as TaskSortField)
        : "createdAt",

    sortDirection:
      rawOrder &&
      sortDirections.includes(
        rawOrder as TaskSortDirection,
      )
        ? (rawOrder as TaskSortDirection)
        : "desc",
  };
}

export function useTaskFilters(
  tasks: Task[],
) {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams],
  );

  const visibleTasks = useMemo(
    () =>
      filterAndSortTasks(
        tasks,
        filters,
      ),
    [tasks, filters],
  );

  function updateFilters(
    changes: Partial<TaskFilters>,
  ) {
    const nextFilters = {
      ...filters,
      ...changes,
    };

    const nextParams =
      new URLSearchParams();

    if (nextFilters.search.trim()) {
      nextParams.set(
        "search",
        nextFilters.search,
      );
    }

    if (nextFilters.status !== "ALL") {
      nextParams.set(
        "status",
        nextFilters.status,
      );
    }

    if (
      nextFilters.priority !== "ALL"
    ) {
      nextParams.set(
        "priority",
        nextFilters.priority,
      );
    }

    if (nextFilters.assigneeId) {
      nextParams.set(
        "assignee",
        nextFilters.assigneeId,
      );
    }

    if (
      nextFilters.sortBy !==
      "createdAt"
    ) {
      nextParams.set(
        "sort",
        nextFilters.sortBy,
      );
    }

    if (
      nextFilters.sortDirection !==
      "desc"
    ) {
      nextParams.set(
        "order",
        nextFilters.sortDirection,
      );
    }

    setSearchParams(nextParams);
  }

  function resetFilters() {
    setSearchParams({});
  }

  return {
    filters,
    visibleTasks,
    updateFilters,
    resetFilters,
  };
}