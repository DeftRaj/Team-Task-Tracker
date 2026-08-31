import {
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { ProjectsPage } from "./ProjectsPage";

import {
  createProject,
  getProjects,
} from "../services/projectService";

import {
  getTasks,
} from "../services/taskService";

vi.mock("../services/projectService", () => ({
  createProject: vi.fn(),
  getProjects: vi.fn(),
}));

vi.mock("../services/taskService", () => ({
  getTasks: vi.fn(),
}));

vi.mock("../features/auth/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: "user-1",
      name: "Demo User",
      email: "demo@example.com",
    },
  }),
}));

const mockedGetProjects =
  vi.mocked(getProjects);

const mockedCreateProject =
  vi.mocked(createProject);

const mockedGetTasks =
  vi.mocked(getTasks);

const project = {
  id: "project-1",
  name: "Website Redesign",
  description: "Redesign website",
  memberIds: ["user-1", "user-2"],
  createdAt: "2026-08-01T00:00:00.000Z",
};

const task = {
  id: "task-1",
  projectId: "project-1",
  title: "Design homepage",
  description: "",
  status: "DONE" as const,
  priority: "HIGH" as const,
  assigneeId: "user-1",
  dueDate: "2026-09-05T00:00:00.000Z",
  createdAt: "2026-08-20T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
};

function renderProjectsPage() {
  return render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>,
  );
}

describe("ProjectsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedGetProjects.mockResolvedValue([
      project,
    ]);

    mockedGetTasks.mockResolvedValue([
      task,
    ]);
  });

  it("shows loading state", () => {
    mockedGetProjects.mockReturnValue(
      new Promise(() => {}),
    );

    mockedGetTasks.mockReturnValue(
      new Promise(() => {}),
    );

    renderProjectsPage();

    expect(
      screen.getByText("Loading projects..."),
    ).toBeInTheDocument();
  });

  it("renders projects after loading", async () => {
    renderProjectsPage();

    expect(
      await screen.findByText(
        "Website Redesign",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("1 tasks"),
    ).toBeInTheDocument();
  });

  it("filters projects by search term", async () => {
    const user = userEvent.setup();

    mockedGetProjects.mockResolvedValue([
      project,
      {
        id: "project-2",
        name: "Mobile App",
        description: "Build mobile app",
        memberIds: ["user-1"],
        createdAt:
          "2026-08-02T00:00:00.000Z",
      },
    ]);

    renderProjectsPage();

    await screen.findByText(
      "Website Redesign",
    );

    const searchInput =
      screen.getByRole("searchbox", {
        name: "Search projects",
      });

    await user.type(
      searchInput,
      "mobile",
    );

    expect(
      screen.getByText("Mobile App"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        "Website Redesign",
      ),
    ).not.toBeInTheDocument();
  });

  it("shows an empty state when search has no matches", async () => {
    const user = userEvent.setup();

    renderProjectsPage();

    await screen.findByText(
      "Website Redesign",
    );

    await user.type(
      screen.getByRole("searchbox", {
        name: "Search projects",
      }),
      "does-not-exist",
    );

    expect(
      screen.getByText("No projects found"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Try a different project name.",
      ),
    ).toBeInTheDocument();
  });

  it("creates a project successfully", async () => {
  const user = userEvent.setup();

  mockedCreateProject.mockResolvedValue({
    id: "project-2",
    name: "Mobile App",
    description: "Build mobile app",
    memberIds: ["user-1"],
    createdAt:
      "2026-08-31T00:00:00.000Z",
  });

  renderProjectsPage();

  await screen.findByText(
    "Website Redesign",
  );

  await user.click(
    screen.getByRole("button", {
      name: "Create project",
    }),
  );

  const dialog = screen.getByRole("dialog");

  await user.type(
    within(dialog).getByLabelText(
      "Project name",
    ),
    "Mobile App",
  );

  await user.type(
    within(dialog).getByLabelText(
      "Description",
    ),
    "Build mobile app",
  );

  await user.click(
    within(dialog).getByRole("button", {
      name: "Create project",
    }),
  );

  expect(
    await screen.findByText(
      "Project created successfully.",
    ),
  ).toBeInTheDocument();
});

 it("shows validation when project name is empty", async () => {
  const user = userEvent.setup();

  renderProjectsPage();

  await screen.findByText(
    "Website Redesign",
  );

  await user.click(
    screen.getByRole("button", {
      name: "Create project",
    }),
  );

  const dialog = screen.getByRole("dialog");

  await user.click(
    within(dialog).getByRole("button", {
      name: "Create project",
    }),
  );

  expect(
    screen.getByText(
      "Project name is required.",
    ),
  ).toBeInTheDocument();

  expect(
    mockedCreateProject,
  ).not.toHaveBeenCalled();
});

  it("shows service failure when project creation fails", async () => {
  const user = userEvent.setup();

  mockedCreateProject.mockRejectedValue(
    new Error(
      "Unable to create project.",
    ),
  );

  renderProjectsPage();

  await screen.findByText(
    "Website Redesign",
  );

  await user.click(
    screen.getByRole("button", {
      name: "Create project",
    }),
  );

  const dialog = screen.getByRole("dialog");

  await user.type(
    within(dialog).getByLabelText(
      "Project name",
    ),
    "Broken Project",
  );

  await user.click(
    within(dialog).getByRole("button", {
      name: "Create project",
    }),
  );

  expect(
    await screen.findByRole("alert"),
  ).toHaveTextContent(
    "Unable to create project.",
  );

  expect(
    screen.getByRole("dialog"),
  ).toBeInTheDocument();
});

  it("closes the create dialog with Escape", async () => {
  const user = userEvent.setup();

  renderProjectsPage();

  await screen.findByText(
    "Website Redesign",
  );

  const openButton =
    screen.getByRole("button", {
      name: "Create project",
    });

  await user.click(openButton);

  expect(
    screen.getByRole("dialog"),
  ).toBeInTheDocument();

  await user.keyboard("{Escape}");

  expect(
    screen.queryByRole("dialog"),
  ).not.toBeInTheDocument();
});

  it("returns focus to the create button after closing the dialog", async () => {
  const user = userEvent.setup();

  renderProjectsPage();

  await screen.findByText(
    "Website Redesign",
  );

  const openButton =
    screen.getByRole("button", {
      name: "Create project",
    });

  await user.click(openButton);

  expect(
    screen.getByRole("dialog"),
  ).toBeInTheDocument();

  await user.keyboard("{Escape}");

  expect(
    screen.queryByRole("dialog"),
  ).not.toBeInTheDocument();

  expect(openButton).toHaveFocus();
});
});