import { Badge } from "../../components/ui/Badge";

import type { Task } from "../../types/task";
import type { User } from "../../types/user";

import {
  formatTaskStatus,
  getTaskPriorityVariant,
  getTaskStatusVariant,
} from "./task.utils";

interface TaskRowProps {
  task: Task;
  assignee: User | undefined;
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
        <Badge
          variant={getTaskStatusVariant(
            task.status,
          )}
        >
          {formatTaskStatus(task.status)}
        </Badge>
      </div>

      <div className="task-row-priority">
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
    </article>
  );
}