import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

import type {
  Task,
  TaskStatus,
} from "../../types/task";
import type { User } from "../../types/user";

import {
  formatTaskStatus,
  getTaskPriorityVariant,
  getTaskStatusVariant,
} from "./task.utils";

interface TaskRowProps {
  task: Task;
  assignee: User | undefined;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (
    taskId: string,
    status: TaskStatus,
  ) => void;
  isSubmitting: boolean;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(date));
}

export function TaskRow({
  task,
  assignee,
  onEdit,
  onDelete,
  onStatusChange,
  isSubmitting,
}: TaskRowProps) {
  return (
    <article className="task-row">
      <div className="task-row-main">
        <h3>{task.title}</h3>

        {task.description && (
          <p>{task.description}</p>
        )}
      </div>

      <div className="task-row-status">
        <span className="task-row-label">
          Status
        </span>

        <select
          aria-label={`Change status for ${task.title}`}
          value={task.status}
          disabled={isSubmitting}
          onChange={(event) =>
            onStatusChange(
              task.id,
              event.target.value as TaskStatus,
            )
          }
        >
          <option value="TODO">
            To Do
          </option>

          <option value="IN_PROGRESS">
            In Progress
          </option>

          <option value="DONE">
            Done
          </option>
        </select>

        <Badge
          variant={getTaskStatusVariant(
            task.status,
          )}
        >
          {formatTaskStatus(task.status)}
        </Badge>
      </div>

      <div className="task-row-priority">
        <span className="task-row-label">
          Priority
        </span>

        <Badge
          variant={getTaskPriorityVariant(
            task.priority,
          )}
        >
          {task.priority}
        </Badge>
      </div>

      <div className="task-row-assignee">
        <span className="task-row-label">
          Assignee
        </span>

        <span>
          {assignee?.name ?? "Unassigned"}
        </span>
      </div>

      <div className="task-row-due-date">
        <span className="task-row-label">
          Due
        </span>

        <time dateTime={task.dueDate}>
          {formatDate(task.dueDate)}
        </time>
      </div>

      <div className="task-row-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onEdit(task)}
          disabled={isSubmitting}
        >
          Edit
        </Button>

        <Button
          type="button"
          variant="danger"
          onClick={() => onDelete(task)}
          disabled={isSubmitting}
        >
          Delete
        </Button>
      </div>
    </article>
  );
}