import { Link, useParams } from "react-router";

import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/feedback/ErrorState";
import { EmptyState } from "../components/feedback/EmptyState";

import {
  useProjectDetailsData,
} from "../features/projects/useProjectDetailsData";

import { TaskList } from "../features/tasks/TaskList";

export function ProjectDetailsPage() {
  const { projectId } = useParams();

  const {
    project,
    tasks,
    users,
    summary,
    isLoading,
    error,
    notFound,
    reload,
  } = useProjectDetailsData(projectId);

  if (isLoading) {
    return (
      <>
        <header className="page-header">
          <p>
            Loading project...
          </p>
        </header>
      </>
    );
  }

  if (notFound) {
    return (
      <EmptyState
        title="Project not found"
        description="The project you're looking for doesn't exist or may have been removed."
        action={
          <Link to="/projects">
            Back to projects
          </Link>
        }
      />
    );
  }

  if (error || !project || !summary) {
    return (
      <ErrorState
        message={
          error ??
          "Unable to load project."
        }
        onRetry={reload}
      />
    );
  }

  return (
    <>
      <Link
        to="/projects"
        className="back-link"
      >
        ← Back to projects
      </Link>

      <header className="page-header project-details-header">
        <div>
          <h1 className="page-title">
            {project.name}
          </h1>

          <p className="page-description">
            {project.description}
          </p>
        </div>

        <div
          className="project-details-progress"
          aria-label={`Project progress ${summary.progressPercentage}%`}
        >
          <span>Progress</span>

          <strong>
            {summary.progressPercentage}%
          </strong>
        </div>
      </header>

      <section
        className="project-details-meta"
        aria-label="Project summary"
      >
        <Card>
          <div className="detail-stat">
            <span>Tasks</span>

            <strong>
              {summary.taskCount}
            </strong>
          </div>
        </Card>

        <Card>
          <div className="detail-stat">
            <span>Members</span>

            <strong>
              {summary.memberCount}
            </strong>
          </div>
        </Card>

        <Card>
          <div className="detail-stat">
            <span>Completed</span>

            <strong>
              {
                tasks.filter(
                  (task) =>
                    task.status === "DONE",
                ).length
              }
            </strong>
          </div>
        </Card>
      </section>

      <section className="project-tasks-section">
        <div className="section-heading">
          <div>
            <h2>Tasks</h2>

            <p>
              Manage the work assigned to this
              project.
            </p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="This project doesn't have any tasks."
          />
        ) : (
          <Card>
            <TaskList
              tasks={tasks}
              users={users}
            />
          </Card>
        )}
      </section>
    </>
  );
}