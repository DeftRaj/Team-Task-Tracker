import { Navigate, Outlet } from "react-router";

import { AppShell } from "./AppShell";
import { useAuth } from "../../features/auth/useAuth";

export function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/sign-in"
        replace
      />
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}