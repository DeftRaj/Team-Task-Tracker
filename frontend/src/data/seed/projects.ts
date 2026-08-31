import type { Project } from "../../types/project";

export const seedProjects: Project[] = [
  {
    id: "project-1",
    name: "Website Redesign",
    description:
      "Redesign the company marketing website with a modern responsive experience.",
    memberIds: ["user-1", "user-2", "user-4"],
    createdAt: "2026-08-05T09:30:00.000Z",
  },
  {
    id: "project-2",
    name: "Mobile App",
    description:
      "Build the next version of the customer mobile application.",
    memberIds: ["user-1", "user-3", "user-5"],
    createdAt: "2026-08-10T11:00:00.000Z",
  },
  {
    id: "project-3",
    name: "Internal Tools",
    description:
      "Improve internal productivity and operations tools.",
    memberIds: ["user-2", "user-4", "user-5"],
    createdAt: "2026-08-15T14:15:00.000Z",
  },
];