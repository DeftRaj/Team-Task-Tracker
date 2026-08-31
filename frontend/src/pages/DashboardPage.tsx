import { Link } from "react-router";

import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/feedback/ErrorState";
import { EmptyState } from "../components/feedback/EmptyState";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

import { useDashboardData } from "../features/dashboard/useDashboardData";
import type {
  TaskPriority,
  TaskStatus,
} from "../types/task";

function getStatusVariant(
  status: TaskStatus,
) {
  switch (status) {
    case "DONE":
      return "success" as const;

    case "IN_PROGRESS":
      return "info" as const;

    case "TODO":
      return "neutral" as const;
  }
}

function getPriorityVariant(
  priority: TaskPriority,
) {
  switch (priority) {
    case "HIGH":
      return "danger" as const;

    case "MEDIUM":
      return "warning" as const;

    case "LOW":
      return "neutral" as const;
  }
}

function formatStatus(status: TaskStatus) {
  switch (status) {
    case "TODO":
      return "To Do";

    case "IN_PROGRESS":
      return "In Progress";

    case "DONE":
      return "Done";
  }
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

export function DashboardPage() {
  const {
    tasks,
    stats,
    recentTasks,
    isLoading,
    error,
    reload,
  } = useDashboardData();

  if (isLoading) {
    return (
      <>
        <header className="page-header">
          <h1 className="page-title">
            Dashboard
          </h1>
        </header>

        <div
          className="dashboard-grid dashboard-loading-grid"
          aria-live="polite"
          aria-busy="true"
        >
          <Card>
            <div className="dashboard-loading">
              Loading dashboard...
            </div>
          </Card>

          <Card>
            <div className="dashboard-loading">
              Loading task summary...
            </div>
          </Card>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <header className="page-header">
          <h1 className="page-title">
            Dashboard
          </h1>
        </header>

        <ErrorState
          message={error}
          onRetry={reload}
        />
      </>
    );
  }

  if (tasks.length === 0) {
    return (
      <>
        <header className="page-header">
          <h1 className="page-title">
            Dashboard
          </h1>

          <p className="page-description">
            Get an overview of task progress,
            upcoming work, and items that need
            attention.
          </p>
        </header>

        <EmptyState
          title="No tasks yet"
          description="Create your first task to start tracking team work."
          action={
            <Link to="/projects">
              <Button type="button">
                View projects
              </Button>
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <header className="page-header dashboard-page-header">
        <div>
          <h1 className="page-title">
            Dashboard
          </h1>

          <p className="page-description">
            Get an overview of task progress,
            upcoming work, and items that need
            attention.
          </p>
        </div>

        <Link to="/projects">
          <Button type="button">
            View projects
          </Button>
        </Link>
      </header>

      <section
        className="dashboard-stats"
        aria-label="Task summary"
      >
        <Card className="stat-card">
          <p className="stat-label">
            Total tasks
          </p>

          <p className="stat-value">
            {stats.total}
          </p>
        </Card>

        <Card className="stat-card">
          <p className="stat-label">
            To Do
          </p>

          <p className="stat-value">
            {stats.todo}
          </p>
        </Card>

        <Card className="stat-card">
          <p className="stat-label">
            In Progress
          </p>

          <p className="stat-value">
            {stats.inProgress}
          </p>
        </Card>

        <Card className="stat-card">
          <p className="stat-label">
            Done
          </p>

          <p className="stat-value">
            {stats.done}
          </p>
        </Card>
      </section>

      <section className="dashboard-main-grid">
        <Card className="dashboard-progress-card">
          <div className="card-section-header">
            <div>
              <h2>Overall progress</h2>

              <p>
                {stats.done} of {stats.total} tasks
                completed.
              </p>
            </div>

            <strong>
              {stats.completionPercentage}%
            </strong>
          </div>

          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              stats.completionPercentage
            }
            aria-label={`Task completion ${stats.completionPercentage}%`}
          >
            <div
              className="progress-bar-value"
              style={{
                width: `${stats.completionPercentage}%`,
              }}
            />
          </div>
        </Card>

        <Card className="dashboard-attention-card">
          <div className="card-section-header">
            <div>
              <h2>Needs attention</h2>

              <p>
                Open tasks that may require action.
              </p>
            </div>
          </div>

          <div className="attention-grid">
            <div>
              <strong>
                {stats.overdue}
              </strong>

              <span>Overdue</span>
            </div>

            <div>
              <strong>
                {stats.dueSoon}
              </strong>

              <span>Due in 7 days</span>
            </div>
          </div>
        </Card>
      </section>

      <section className="dashboard-recent">
        <div className="section-heading">
          <div>
            <h2>Recently updated tasks</h2>

            <p>
              The latest task activity across the
              team.
            </p>
          </div>

          <Link to="/projects">
            View projects
          </Link>
        </div>

        <Card>
          <div className="task-list">
            {recentTasks.map((task) => (
              <article
                className="dashboard-task"
                key={task.id}
              >
                <div className="dashboard-task-main">
                  <h3>{task.title}</h3>

                  <p>
                    Due {formatDate(task.dueDate)}
                  </p>
                </div>

                <div className="dashboard-task-meta">
                  <Badge
                    variant={getStatusVariant(
                      task.status,
                    )}
                  >
                    {formatStatus(task.status)}
                  </Badge>

                  <Badge
                    variant={getPriorityVariant(
                      task.priority,
                    )}
                  >
                    {task.priority}
                  </Badge>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}