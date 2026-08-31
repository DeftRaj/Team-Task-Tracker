import { NavLink } from "react-router";

import { useAuth } from "../../features/auth/useAuth";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { logout } = useAuth();

  function handleLogout() {
    onCloseMobile();
    logout();
  }

  return (
    <aside
      className={`sidebar ${
        isMobileOpen ? "sidebar-mobile-open" : ""
      }`}
      aria-label="Application navigation"
    >
      <div className="sidebar-brand">
        <div className="sidebar-brand-main">
          <span className="sidebar-brand-mark">
            TT
          </span>

          <span>Team Tracker</span>
        </div>

        <button
          type="button"
          className="sidebar-close-button"
          aria-label="Close navigation"
          onClick={onCloseMobile}
        >
          ×
        </button>
      </div>

      <nav aria-label="Main navigation">
        <NavLink
          to="/dashboard"
          className="sidebar-link"
          onClick={onCloseMobile}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className="sidebar-link"
          onClick={onCloseMobile}
        >
          Projects
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}