import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createProject,
  getProjects,
} from "../../services/projectService";

import { getTasks } from "../../services/taskService";

import type { Project } from "../../types/project";
import type { Task } from "../../types/task";

import {
  getProjectSummaries,
  searchProjects,
  type ProjectSummary,
} from "./projects.utils";

interface ProjectsState {
  projects: Project[];
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  tasks: [],
  isLoading: true,
  error: null,
};

export function useProjectsData() {
  const [state, setState] =
    useState<ProjectsState>(initialState);

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      getProjects(),
      getTasks(),
    ])
      .then(([projects, tasks]) => {
        if (isCancelled) {
          return;
        }

        setState({
          projects,
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
          projects: [],
          tasks: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load projects.",
        });
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const projectSummaries =
    useMemo<ProjectSummary[]>(
      () =>
        getProjectSummaries(
          state.projects,
          state.tasks,
        ),
      [state.projects, state.tasks],
    );

  const filteredProjects = useMemo(
    () =>
      searchProjects(
        projectSummaries,
        searchTerm,
      ),
    [projectSummaries, searchTerm],
  );

  async function reload() {
    setState((current) => ({
      ...current,
      isLoading: true,
      error: null,
    }));

    try {
      const [projects, tasks] =
        await Promise.all([
          getProjects(),
          getTasks(),
        ]);

      setState({
        projects,
        tasks,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      setState({
        projects: [],
        tasks: [],
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load projects.",
      });
    }
  }

  async function addProject(
    project: Project,
  ) {
    const createdProject =
      await createProject(project);

    setState((current) => ({
      ...current,
      projects: [
        ...current.projects,
        createdProject,
      ],
    }));
  }

  return {
    projects: filteredProjects,
    searchTerm,
    setSearchTerm,
    isLoading: state.isLoading,
    error: state.error,
    reload,
    addProject,
  };
}