import { NavLink } from "react-router";

import { useAuth } from "../../features/auth/useAuth";

export function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span>TT</span>
        <span>Team Tracker</span>
      </div>

      <nav aria-label="Main navigation">
        <NavLink
          to="/dashboard"
          className="sidebar-link"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className="sidebar-link"
        >
          Projects
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-link sidebar-logout"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}