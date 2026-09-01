import type {
  TaskPriority,
  TaskStatus,
} from "../../types/task";

export type TaskSortField =
  | "dueDate"
  | "createdAt";

export type TaskSortDirection =
  | "asc"
  | "desc";

export interface TaskFilters {
  search: string;
  status: TaskStatus | "ALL";
  priority: TaskPriority | "ALL";
  assigneeId: string;
  sortBy: TaskSortField;
  sortDirection: TaskSortDirection;
}