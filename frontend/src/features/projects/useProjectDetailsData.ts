import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getProjectById } from "../../services/projectService";
import {
  getTasksByProjectId,
} from "../../services/taskService";
import { getUsers } from "../../services/userService";

import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import type { User } from "../../types/user";

import { getProjectSummary } from "./projects.utils";

interface ProjectDetailsState {
  project: Project | null;
  tasks: Task[];
  users: User[];
  isLoading: boolean;
  error: string | null;
  loadedProjectId: string | null;
}

const initialState: ProjectDetailsState = {
  project: null,
  tasks: [],
  users: [],
  isLoading: true,
  error: null,
  loadedProjectId: null,
};

export function useProjectDetailsData(
  projectId: string | undefined,
) {
  const [state, setState] =
    useState<ProjectDetailsState>(
      initialState,
    );

  useEffect(() => {
    if (!projectId) {
      return;
    }

    let isCancelled = false;

    Promise.all([
      getProjectById(projectId),
      getTasksByProjectId(projectId),
      getUsers(),
    ])
      .then(
        ([project, tasks, users]) => {
          if (isCancelled) {
            return;
          }

          setState({
            project,
            tasks,
            users,
            isLoading: false,
            error: null,
            loadedProjectId: projectId,
          });
        },
      )
      .catch((error: unknown) => {
        if (isCancelled) {
          return;
        }

        setState({
          project: null,
          tasks: [],
          users: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load project.",
          loadedProjectId: projectId,
        });
      });

    return () => {
      isCancelled = true;
    };
  }, [projectId]);

  const isCurrentProjectLoaded =
  state.loadedProjectId === projectId;

const isLoading =
  Boolean(projectId) &&
  !isCurrentProjectLoaded;

const error =
  isCurrentProjectLoaded
    ? state.error
    : null;

const project =
  isCurrentProjectLoaded
    ? state.project
    : null;

const tasks = useMemo(
  () =>
    isCurrentProjectLoaded
      ? state.tasks
      : [],
  [isCurrentProjectLoaded, state.tasks],
);

const users = useMemo(
  () =>
    isCurrentProjectLoaded
      ? state.users
      : [],
  [isCurrentProjectLoaded, state.users],
);

  const notFound =
    !projectId ||
    (!isLoading &&
      state.loadedProjectId === projectId &&
      !state.error &&
      !state.project);

  const summary = useMemo(() => {
    if (!project) {
      return null;
    }

    return getProjectSummary(
      project,
      tasks,
    );
  }, [project, tasks]);

  async function reload() {
    if (!projectId) {
      return;
    }

    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
      loadedProjectId: null,
    }));

    try {
      const [project, tasks, users] =
        await Promise.all([
          getProjectById(projectId),
          getTasksByProjectId(projectId),
          getUsers(),
        ]);

      setState({
        project,
        tasks,
        users,
        isLoading: false,
        error: null,
        loadedProjectId: projectId,
      });
    } catch (error: unknown) {
      setState({
        project: null,
        tasks: [],
        users: [],
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load project.",
        loadedProjectId: projectId,
      });
    }
  }

  return {
    project,
    tasks,
    users,
    isLoading,
    error,
    notFound,
    summary,
    reload,
  };
}