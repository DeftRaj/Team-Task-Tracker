import { useAuth } from "../../features/auth/useAuth";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div>
        <p className="app-header-title">
          Team Task Tracker
        </p>
      </div>

      <div className="app-header-user">
        <span>{user?.name}</span>

        <div
          className="avatar"
          aria-hidden="true"
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}