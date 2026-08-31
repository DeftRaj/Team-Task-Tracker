import type { Task } from "../../types/task";

export interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
  dueSoon: number;
  completionPercentage: number;
}

// const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getDashboardStats(
  tasks: Task[],
  now = new Date(),
): DashboardStats {
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const nextSevenDays = new Date(todayStart);
  nextSevenDays.setDate(
    nextSevenDays.getDate() + 7,
  );

  const todo = tasks.filter(
    (task) => task.status === "TODO",
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "IN_PROGRESS",
  ).length;

  const done = tasks.filter(
    (task) => task.status === "DONE",
  ).length;

  const overdue = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);

    return (
      dueDate < todayStart &&
      task.status !== "DONE"
    );
  }).length;

  const dueSoon = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);

    return (
      dueDate >= todayStart &&
      dueDate <= nextSevenDays &&
      task.status !== "DONE"
    );
  }).length;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((done / tasks.length) * 100);

  return {
    total: tasks.length,
    todo,
    inProgress,
    done,
    overdue,
    dueSoon,
    completionPercentage,
  };
}

export function getRecentTasks(
  tasks: Task[],
  limit = 5,
): Task[] {
  return [...tasks]
    .sort(
      (first, second) =>
        new Date(second.updatedAt).getTime() -
        new Date(first.updatedAt).getTime(),
    )
    .slice(0, limit);
}