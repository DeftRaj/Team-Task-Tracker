import {
  useEffect,
  useState,
} from "react";

import {
  createTask,
  deleteTask,
  getTasksByProjectId,
  updateTask,
} from "../../services/taskService";

import type { Task } from "../../types/task";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface TaskMutationState {
  isSubmitting: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: true,
  error: null,
};

export function useProjectTasks(
  projectId: string | undefined,
) {
  const [state, setState] =
    useState<TaskState>(initialState);

  const [
    mutationState,
    setMutationState,
  ] = useState<TaskMutationState>({
    isSubmitting: false,
    error: null,
  });

  useEffect(() => {
    if (!projectId) {
      return;
    }

    let isCancelled = false;

    getTasksByProjectId(projectId)
      .then((tasks) => {
        if (isCancelled) {
          return;
        }

        setState({
          tasks,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return;
        }

        setState({
          tasks: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load project tasks.",
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [projectId]);

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

    try {
      const tasks =
        await getTasksByProjectId(
          projectId,
        );

      setState({
        tasks,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      setState((current) => ({
        ...current,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load project tasks.",
      }));

      throw error;
    }
  }

  async function addTask(task: Task) {
    setMutationState({
      isSubmitting: true,
      error: null,
    });

    try {
      const createdTask =
        await createTask(task);

      setState((current) => ({
        ...current,
        tasks: [
          ...current.tasks,
          createdTask,
        ],
      }));

      setMutationState({
        isSubmitting: false,
        error: null,
      });
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

      setState((current) => ({
        ...current,
        tasks: current.tasks.map(
          (task) =>
            task.id === taskId
              ? updatedTask
              : task,
        ),
      }));

      setMutationState({
        isSubmitting: false,
        error: null,
      });
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

      setState((current) => ({
        ...current,
        tasks: current.tasks.filter(
          (task) => task.id !== taskId,
        ),
      }));

      setMutationState({
        isSubmitting: false,
        error: null,
      });
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
  }

  return {
    tasks: state.tasks,
    isLoading: state.isLoading,
    error: state.error,

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