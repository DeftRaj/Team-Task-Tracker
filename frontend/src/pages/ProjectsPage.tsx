import { useState } from "react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/feedback/EmptyState";
import { ErrorState } from "../components/feedback/ErrorState";
import { Modal } from "../components/ui/Modal";

import { useAuth } from "../features/auth/useAuth";
import { ProjectCard } from "../features/projects/ProjectCard";
import { ProjectForm } from "../features/projects/ProjectForm";
import { useProjectsData } from "../features/projects/useProjectsData";

export function ProjectsPage() {
  const { user } = useAuth();

  const {
    projects,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    reload,
    addProject,
  } = useProjectsData();

  const [
    isCreateModalOpen,
    setIsCreateModalOpen,
  ] = useState(false);

  const [
    isCreating,
    setIsCreating,
  ] = useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [createError, setCreateError] =
    useState<string | null>(null);

  async function handleCreateProject(values: {
    name: string;
    description: string;
    memberIds: string[];
  }) {
    if (!user) {
      return;
    }

    setIsCreating(true);
    setCreateError(null);
    setSuccessMessage("");

    try {
      await addProject({
        id: crypto.randomUUID(),
        name: values.name,
        description: values.description,
        memberIds: values.memberIds,
        createdAt: new Date().toISOString(),
      });

      setIsCreateModalOpen(false);
      setSuccessMessage(
        "Project created successfully.",
      );
    } catch (error: unknown) {
      setCreateError(
        error instanceof Error
          ? error.message
          : "Unable to create project.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  function handleOpenCreateModal() {
    setCreateError(null);
    setSuccessMessage("");
    setIsCreateModalOpen(true);
  }

  function handleCloseCreateModal() {
    if (isCreating) {
      return;
    }

    setCreateError(null);
    setIsCreateModalOpen(false);
  }

  if (isLoading) {
    return (
      <>
        <header className="page-header">
          <h1 className="page-title">
            Projects
          </h1>
        </header>

        <Card>
          <div className="dashboard-loading">
            Loading projects...
          </div>
        </Card>
      </>
    );
  }

  if (error) {
    return (
      <>
        <header className="page-header">
          <h1 className="page-title">
            Projects
          </h1>
        </header>

        <ErrorState
          message={error}
          onRetry={reload}
        />
      </>
    );
  }

  return (
    <>
      <header className="page-header projects-page-header">
        <div>
          <h1 className="page-title">
            Projects
          </h1>

          <p className="page-description">
            Browse projects and keep track of
            team progress.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenCreateModal}
        >
          Create project
        </Button>
      </header>

      {successMessage && (
        <div
          className="success-message"
          role="status"
        >
          {successMessage}
        </div>
      )}

      <section className="projects-toolbar">
        <div className="search-field">
          <label htmlFor="project-search">
            Search projects
          </label>

          <input
            id="project-search"
            type="search"
            value={searchTerm}
            placeholder="Search by project name"
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>
      </section>

      {projects.length === 0 ? (
        <EmptyState
          title={
            searchTerm.trim()
              ? "No projects found"
              : "No projects yet"
          }
          description={
            searchTerm.trim()
              ? "Try a different project name."
              : "Create your first project to start organizing team work."
          }
          action={
            !searchTerm.trim() ? (
              <Button
                type="button"
                onClick={handleOpenCreateModal}
              >
                Create project
              </Button>
            ) : undefined
          }
        />
      ) : (
        <section
          className="projects-grid"
          aria-label="Projects"
        >
          {projects.map((summary) => (
            <ProjectCard
              key={summary.project.id}
              summary={summary}
            />
          ))}
        </section>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        title="Create project"
        onClose={handleCloseCreateModal}
      >
        {createError && (
          <div
            className="form-error-summary"
            role="alert"
          >
            {createError}
          </div>
        )}

        {user && (
          <ProjectForm
            currentUserId={user.id}
            isSubmitting={isCreating}
            onSubmit={handleCreateProject}
            onCancel={handleCloseCreateModal}
          />
        )}
      </Modal>
    </>
  );
}