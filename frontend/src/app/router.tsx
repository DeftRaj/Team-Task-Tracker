import { createBrowserRouter, Navigate,} from "react-router";

import { SignInPage } from "../pages/SignInPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { ProjectDetailsPage } from "../pages/ProjectDetailsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

import { ProtectedLayout } from "../components/layout/ProtectedLayout";
import { RouteErrorFallback } from "../components/feedback/RouteErrorFallback";

export const router = createBrowserRouter([
    // Pathless root route: has no path/element of its own, so React
    // Router renders its children directly, but its errorElement
    // catches render errors from ANY route below it. This is what
    // makes "Trigger error boundary" in DevTools show our own
    // fallback instead of React Router's default error page.
  {
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: "/",
        element: (<Navigate to="/sign-in" replace />),
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
    ],
  },
]);