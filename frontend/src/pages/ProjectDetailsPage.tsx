import { useState } from "react";

import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

import { TaskForm } from "../features/tasks/TaskForm";

import { Link, useParams } from "react-router";

import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/feedback/ErrorState";
import { EmptyState } from "../components/feedback/EmptyState";

import { useProjectDetailsData } from "../features/projects/useProjectDetailsData";

import { TaskList } from "../features/tasks/TaskList";
import { useTaskFilters } from "../features/tasks/useTaskFilters";

import { TaskFilters } from "../features/tasks/TaskFilters";
import { useProjectTasks } from "../features/tasks/useProjectTasks";

import { getProjectSummary } from "../features/projects/projects.utils";

import type { Task } from "../types/task";
import {
  taskToFormValues,
  type TaskFormValues,
} from "../features/tasks/taskForm.validation";

import { DeleteTaskDialog } from "../features/tasks/DeleteTaskDialog";
import { LoadingState } from "../components/feedback/LoadingState";

export function ProjectDetailsPage() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const [taskSuccessMessage, setTaskSuccessMessage] = useState("");

  const [taskActionError, setTaskActionError] = useState<string | null>(null);

  const { projectId } = useParams();
  const {
  project,
  users,
  isLoading: isProjectLoading,
  error: projectError,
  notFound,
  reload,
} = useProjectDetailsData(projectId);

const {
  tasks: projectTasks,
  isLoading: areTasksLoading,
  error: tasksError,
  refreshTasks,
  addTask,
  editTask,
  removeTask,
  isSubmitting: isTaskSubmitting,
  mutationError,
  clearMutationError,
} = useProjectTasks(projectId);

  const emptyTaskValues: TaskFormValues = {
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    assigneeId: "",
    dueDate: "",
  };

  const { filters, visibleTasks, updateFilters, resetFilters } =
    useTaskFilters(projectTasks);

  async function handleCreateTask(values: TaskFormValues) {
    if (!projectId) {
      return;
    }

    setTaskSuccessMessage("");
    setTaskActionError(null);

    try {
      await addTask({
        id: crypto.randomUUID(),
        projectId,
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        assigneeId: values.assigneeId,
        dueDate: values.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setIsTaskModalOpen(false);

      setTaskSuccessMessage("Task created successfully.");
    } catch {
      setTaskActionError("Unable to create task.");
    }
  }

  if (isProjectLoading) {
  return <LoadingState message="Loading project" />;
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

if (projectError || !project) {
  return (
    <ErrorState
      message={
        projectError ??
        "Unable to load project."
      }
      onRetry={reload}
    />
  );
}

if (areTasksLoading) {
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">
          {project.name}
        </h1>

        <p className="page-description">
          {project.description}
        </p>
      </header>

      <LoadingState message="Loading tasks" />
    </>
  );
}

if (tasksError) {
  return (
    <ErrorState
      message={tasksError}
      onRetry={refreshTasks}
    />
  );
}

const currentSummary =
  getProjectSummary(
    project,
    projectTasks,
  );

  async function handleEditTask(values: TaskFormValues) {
    if (!editingTask) {
      return;
    }

    setTaskSuccessMessage("");
    setTaskActionError(null);

    try {
      await editTask(editingTask.id, {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        assigneeId: values.assigneeId,
        dueDate: values.dueDate,
      });

      setEditingTask(null);

      setTaskSuccessMessage("Task updated successfully.");
    } catch {
      setTaskActionError("Unable to update task.");
    }
  }

  async function handleStatusChange(taskId: string, status: Task["status"]) {
    setTaskSuccessMessage("");
    setTaskActionError(null);

    try {
      await editTask(taskId, {
        status,
      });

      setTaskSuccessMessage("Task status updated.");
    } catch {
      setTaskActionError("Unable to update task status.");
    }
  }

  async function handleDeleteTask() {
    if (!deletingTask) {
      return;
    }

    setTaskSuccessMessage("");
    setTaskActionError(null);

    try {
      await removeTask(deletingTask.id);

      setDeletingTask(null);

      setTaskSuccessMessage("Task deleted successfully.");
    } catch {
      setTaskActionError("Unable to delete task.");
    }
  }

  return (
    <>
      <Link to="/projects" className="back-link">
        ← Back to projects
      </Link>

      <header className="page-header project-details-header">
        <div>
          <h1 className="page-title">{project.name}</h1>

          <p className="page-description">{project.description}</p>
        </div>

        <div
          className="project-details-progress"
          aria-label={`Project progress ${currentSummary.progressPercentage}%`}
        >
          <span>Progress</span>

          <strong>{currentSummary.progressPercentage}%</strong>
        </div>
      </header>
      {taskSuccessMessage && (
        <div className="success-message" role="status">
          {taskSuccessMessage}
        </div>
      )}

      <section className="project-details-meta" aria-label="Project summary">
        <Card>
          <div className="detail-stat">
            <span>Tasks</span>

            <strong>{currentSummary.taskCount}</strong>
          </div>
        </Card>

        <Card>
          <div className="detail-stat">
            <span>Members</span>

            <strong>{currentSummary.memberCount}</strong>
          </div>
        </Card>

        <Card>
          <div className="detail-stat">
            <span>Completed</span>

            <strong>
              {projectTasks.filter((task) => task.status === "DONE").length}
            </strong>
          </div>
        </Card>
      </section>

      <section className="project-tasks-section">
        <div className="section-heading">
          <div>
            <h2>Tasks</h2>

            <p>Manage the work assigned to this project.</p>
          </div>
          <Button
            type="button"
            onClick={() => {
              clearMutationError();
              setIsTaskModalOpen(true);
            }}
          >
            Create task
          </Button>
        </div>
        {projectTasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="This project doesn't have any tasks."
          />
        ) : (
          <>
            <TaskFilters
              filters={filters}
              assignees={users}
              onChange={updateFilters}
            />

            {visibleTasks.length === 0 ? (
              <EmptyState
                title="No tasks match your filters"
                description="Try changing your search or filter selections."
                action={
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={resetFilters}
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
                <TaskList
                  tasks={visibleTasks}
                  users={users}
                  onEdit={(task) => {
                    setTaskActionError(null);
                    setEditingTask(task);
                  }}
                  onDelete={(task) => {
                    setTaskActionError(null);
                    setDeletingTask(task);
                  }}
                  onStatusChange={handleStatusChange}
                  isSubmitting={isTaskSubmitting}
                />
            )}
          </>
        )}
      </section>
      <Modal
        isOpen={isTaskModalOpen}
        title="Create task"
        onClose={() => {
          if (!isTaskSubmitting) {
            setIsTaskModalOpen(false);
            clearMutationError();
          }
        }}
      >
        {mutationError && (
          <div className="form-error-summary" role="alert">
            {mutationError}
          </div>
        )}

        <TaskForm
          initialValues={emptyTaskValues}
          users={users}
          isSubmitting={isTaskSubmitting}
          onSubmit={handleCreateTask}
          onCancel={() => {
            if (!isTaskSubmitting) {
              setIsTaskModalOpen(false);
              clearMutationError();
            }
          }}
        />
      </Modal>

      <Modal
        isOpen={Boolean(editingTask)}
        title="Edit task"
        onClose={() => {
          if (!isTaskSubmitting) {
            setEditingTask(null);
            setTaskActionError(null);
          }
        }}
      >
        {taskActionError && (
          <div className="form-error-summary" role="alert">
            {taskActionError}
          </div>
        )}

        {editingTask && (
          <TaskForm
            key={editingTask.id}
            initialValues={taskToFormValues(editingTask)}
            users={users}
            isSubmitting={isTaskSubmitting}
            onSubmit={handleEditTask}
            onCancel={() => {
              setEditingTask(null);
              setTaskActionError(null);
            }}
          />
        )}
      </Modal>

      <DeleteTaskDialog
        task={deletingTask}
        isDeleting={isTaskSubmitting}
        error={taskActionError}
        onConfirm={handleDeleteTask}
        onCancel={() => {
          if (!isTaskSubmitting) {
            setDeletingTask(null);
            setTaskActionError(null);
          }
        }}
      />
    </>
  );
}
