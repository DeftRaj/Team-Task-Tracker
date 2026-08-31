import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getTasks } from "../../services/taskService";
import type { Task } from "../../types/task";
import {
  getDashboardStats,
  getRecentTasks,
} from "./dashboard.utils";

interface DashboardDataState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: DashboardDataState = {
  tasks: [],
  isLoading: true,
  error: null,
};

export function useDashboardData() {
  const [state, setState] =
    useState<DashboardDataState>(
      INITIAL_STATE,
    );

  useEffect(() => {
    let isMounted = true;

    getTasks()
      .then((tasks) => {
        if (!isMounted) {
          return;
        }

        setState({
          tasks,
          isLoading: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        setState({
          tasks: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load tasks.",
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function reload() {
    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }));

    try {
      const tasks = await getTasks();

      setState({
        tasks,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      setState({
        tasks: [],
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load tasks.",
      });
    }
  }

  const stats = useMemo(
    () => getDashboardStats(state.tasks),
    [state.tasks],
  );

  const recentTasks = useMemo(
    () => getRecentTasks(state.tasks),
    [state.tasks],
  );

  return {
    ...state,
    stats,
    recentTasks,
    reload,
  };
}