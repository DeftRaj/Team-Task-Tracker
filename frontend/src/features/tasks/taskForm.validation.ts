import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "../../types/task";


export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
}

export interface TaskFormErrors {
  title?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: string;
}

const validStatuses: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
];

const validPriorities: TaskPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

export function validateTaskForm(
  values: TaskFormValues,
): TaskFormErrors {
  const errors: TaskFormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Task title is required.";
  }

  if (values.title.trim().length > 150) {
    errors.title =
      "Task title must be 150 characters or fewer.";
  }

  if (!validStatuses.includes(values.status)) {
    errors.status = "Select a valid status.";
  }

  if (
    !validPriorities.includes(
      values.priority,
    )
  ) {
    errors.priority =
      "Select a valid priority.";
  }

  if (!values.assigneeId) {
    errors.assigneeId =
      "Select an assignee.";
  }

  if (!values.dueDate) {
    errors.dueDate =
      "Due date is required.";
  } else {
    const parsedDate = new Date(
      values.dueDate,
    );

    if (Number.isNaN(parsedDate.getTime())) {
      errors.dueDate =
        "Enter a valid due date.";
    }
  }

  

  return errors;
}

export function taskToFormValues(
  task: Task,
): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId,
    dueDate: task.dueDate.slice(0, 10),
  };
}