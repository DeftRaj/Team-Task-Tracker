import { seedProjects } from "./seed/projects";
import { seedTasks } from "./seed/tasks";
import { seedUsers } from "./seed/users";

import type { Project } from "../types/project";
import type { Task } from "../types/task";
import type { User } from "../types/user";

export const mockDatabase: {
  projects: Project[];
  tasks: Task[];
  users: User[];
} = {
  projects: seedProjects.map((project) => ({
    ...project,
    memberIds: [...project.memberIds],
  })),

  tasks: seedTasks.map((task) => ({
    ...task,
  })),

  users: seedUsers.map((user) => ({
    ...user,
  })),
};