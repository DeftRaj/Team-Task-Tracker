import { useState } from "react";

import {
  createTask,
  deleteTask,
  getTasksByProjectId,
  updateTask,
} from "../../services/taskService";

import type { Task } from "../../types/task";

interface TaskMutationState {
  isSubmitting: boolean;
  error: string | null;
}

export function useProjectTasks(
  projectId: string | undefined,
  initialTasks: Task[],
) {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [
    mutationState,
    setMutationState,
  ] = useState<TaskMutationState>({
    isSubmitting: false,
    error: null,
  });

  function clearMutationError() {
    setMutationState((current) => ({
      ...current,
      error: null,
    }));
  }

  async function refreshTasks() {
    if (!projectId) {
      return;
    }

    const refreshedTasks =
      await getTasksByProjectId(projectId);

    setTasks(refreshedTasks);
  }

  async function addTask(task: Task) {
    setMutationState({
      isSubmitting: true,
      error: null,
    });

    try {
      const createdTask =
        await createTask(task);

      setTasks((current) => [
        ...current,
        createdTask,
      ]);
    } catch (error: unknown) {
      setMutationState({
        isSubmitting: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create task.",
      });

      throw error;
    }

    setMutationState({
      isSubmitting: false,
      error: null,
    });
  }

  async function editTask(
    taskId: string,
    changes: Partial<Task>,
  ) {
    setMutationState({
      isSubmitting: true,
      error: null,
    });

    try {
      const updatedTask =
        await updateTask(
          taskId,
          changes,
        );

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? updatedTask
            : task,
        ),
      );
    } catch (error: unknown) {
      setMutationState({
        isSubmitting: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update task.",
      });

      throw error;
    }

    setMutationState({
      isSubmitting: false,
      error: null,
    });
  }

  async function removeTask(
    taskId: string,
  ) {
    setMutationState({
      isSubmitting: true,
      error: null,
    });

    try {
      await deleteTask(taskId);

      setTasks((current) =>
        current.filter(
          (task) => task.id !== taskId,
        ),
      );
    } catch (error: unknown) {
      setMutationState({
        isSubmitting: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete task.",
      });

      throw error;
    }

    setMutationState({
      isSubmitting: false,
      error: null,
    });
  }

  return {
    tasks,
    refreshTasks,
    addTask,
    editTask,
    removeTask,
    isSubmitting:
      mutationState.isSubmitting,
    mutationError:
      mutationState.error,
    clearMutationError,
  };
}