import type {
  TaskPriority,
  TaskStatus,
} from "../../types/task";

export function formatTaskStatus(
  status: TaskStatus,
): string {
  switch (status) {
    case "TODO":
      return "To Do";

    case "IN_PROGRESS":
      return "In Progress";

    case "DONE":
      return "Done";
  }
}

export function getTaskStatusVariant(
  status: TaskStatus,
) {
  switch (status) {
    case "TODO":
      return "neutral" as const;

    case "IN_PROGRESS":
      return "info" as const;

    case "DONE":
      return "success" as const;
  }
}

export function getTaskPriorityVariant(
  priority: TaskPriority,
) {
  switch (priority) {
    case "LOW":
      return "neutral" as const;

    case "MEDIUM":
      return "warning" as const;

    case "HIGH":
      return "danger" as const;
  }
}