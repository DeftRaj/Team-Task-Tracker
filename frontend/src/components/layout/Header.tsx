import { useAuth } from "../../features/auth/useAuth";

interface HeaderProps {
  onOpenNavigation: () => void;
}

export function Header({
  onOpenNavigation,
}: HeaderProps) {
  const { user } = useAuth();

  const userInitial =
    user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="app-header">
      <div className="app-header-left">
        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Open navigation"
          onClick={onOpenNavigation}
        >
          <span aria-hidden="true">☰</span>
        </button>

        <p className="app-header-title">
          Team Task Tracker
        </p>
      </div>

      <div className="app-header-user">
        <span className="app-header-user-name">
          {user?.name}
        </span>

        <div
          className="avatar"
          aria-hidden="true"
        >
          {userInitial}
        </div>
      </div>
    </header>
  );
}