import type {
  TaskFilters,
} from "./taskFilters.types";

export const DEFAULT_TASK_FILTERS: TaskFilters = {
  search: "",
  status: "ALL",
  priority: "ALL",
  assigneeId: "",
  sortBy: "createdAt",
  sortDirection: "desc",
};