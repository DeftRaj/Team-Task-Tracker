import type { Task } from "../../types/task";
import type { User } from "../../types/user";

import { TaskRow } from "./TaskRow";

interface TaskListProps {
  tasks: Task[];
  users: User[];
}

export function TaskList({
  tasks,
  users,
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
          />
        );
      })}
    </div>
  );
}