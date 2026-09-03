import { createBrowserRouter, Navigate } from "react-router";

import { SignInPage } from "../pages/SignInPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { ProjectDetailsPage } from "../pages/ProjectDetailsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

import { ProtectedLayout } from "../components/layout/ProtectedLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/sign-in" replace/>,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },

  {
    element: <ProtectedLayout />,
    children: [
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
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);