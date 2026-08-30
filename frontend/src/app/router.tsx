import { createBrowserRouter } from "react-router";

import { SignInPage } from "../pages/SignInPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { ProjectDetailsPage } from "../pages/ProjectDetailsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/projects",
    element: <ProjectsPage />,
  },
  {
    path: "/projects/:projectId",
    element: <ProjectDetailsPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);