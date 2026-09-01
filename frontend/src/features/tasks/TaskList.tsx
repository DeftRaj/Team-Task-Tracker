import type {
  Task,
  TaskStatus,
} from "../../types/task";
import type { User } from "../../types/user";

import { TaskRow } from "./TaskRow";

interface TaskListProps {
  tasks: Task[];
  users: User[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (
    taskId: string,
    status: TaskStatus,
  ) => void;
  isSubmitting: boolean;
}

export function TaskList({
  tasks,
  users,
  onEdit,
  onDelete,
  onStatusChange,
  isSubmitting,
}: TaskListProps) {
  return (
    <div className="task-list">
      {tasks.map((task) => {
        const assignee = users.find(
          (user) =>
            user.id === task.assigneeId,
        );

        return (
          <TaskRow
            key={task.id}
            task={task}
            assignee={assignee}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={
              onStatusChange
            }
            isSubmitting={isSubmitting}
          />
        );
      })}
    </div>
  );
}