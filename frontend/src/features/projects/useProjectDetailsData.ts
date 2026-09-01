import {
  useEffect,
  useState,
} from "react";

import { getProjectById } from "../../services/projectService";
import { getUsers } from "../../services/userService";

import type { Project } from "../../types/project";
import type { User } from "../../types/user";

interface ProjectDetailsState {
  project: Project | null;
  users: User[];
  isLoading: boolean;
  error: string | null;
  loadedProjectId: string | null;
}

const initialState: ProjectDetailsState = {
  project: null,
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
      getUsers(),
    ])
      .then(([project, users]) => {
        if (isCancelled) {
          return;
        }

        setState({
          project,
          users,
          isLoading: false,
          error: null,
          loadedProjectId: projectId,
        });
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return;
        }

        setState({
          project: null,
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

  const project =
    isCurrentProjectLoaded
      ? state.project
      : null;

  const users =
    isCurrentProjectLoaded
      ? state.users
      : [];

  const error =
    isCurrentProjectLoaded
      ? state.error
      : null;

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
      const [project, users] =
        await Promise.all([
          getProjectById(projectId),
          getUsers(),
        ]);

      setState({
        project,
        users,
        isLoading: false,
        error: null,
        loadedProjectId: projectId,
      });
    } catch (error: unknown) {
      setState({
        project: null,
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

  const notFound =
    !projectId ||
    (!isLoading &&
      isCurrentProjectLoaded &&
      !error &&
      !project);

  return {
    project,
    users,
    isLoading,
    error,
    notFound,
    reload,
  };
}