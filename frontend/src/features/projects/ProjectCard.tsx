import { Link } from "react-router";

import { Card } from "../../components/ui/Card";

import type { ProjectSummary } from "./projects.utils";

interface ProjectCardProps {
  summary: ProjectSummary;
}

export function ProjectCard({
  summary,
}: ProjectCardProps) {
  const {
    project,
    taskCount,
    memberCount,
    progressPercentage,
  } = summary;

  return (
    <Card className="project-card">
      <div className="project-card-content">
        <div>
          <h2 className="project-card-title">
            {project.name}
          </h2>

          <p className="project-card-description">
            {project.description}
          </p>
        </div>

        <div className="project-progress">
          <div className="project-progress-header">
            <span>Progress</span>

            <strong>
              {progressPercentage}%
            </strong>
          </div>

          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercentage}
            aria-label={`${project.name} progress ${progressPercentage}%`}
          >
            <div
              className="progress-bar-value"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="project-card-meta">
          <span>
            {memberCount} members
          </span>

          <span>
            {taskCount} tasks
          </span>
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="project-card-link"
        >
          View project
        </Link>
      </div>
    </Card>
  );
}