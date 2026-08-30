import { useAuth } from "../features/auth/useAuth";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        Signed in as {user?.name}
      </p>

      <button onClick={logout}>
        Logout
      </button>
    </main>
  );
}
