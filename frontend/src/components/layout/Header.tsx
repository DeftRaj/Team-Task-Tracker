import { useState } from "react";

import { useAuth } from "../../features/auth/useAuth";
import { ProfileMenu } from "./ProfileMenu";

interface HeaderProps {
  onOpenNavigation: () => void;
}

function getStoredAvatar(userId: string) {
  return (
    localStorage.getItem(
      `profile-avatar:${userId}`,
    ) ?? ""
  );
}

export function Header({
  onOpenNavigation,
}: HeaderProps) {
  const { user, logout } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState("");
// fixed the 'user' is possibly 'null' bug by adding  const userId = user?.id; and checking 
  if (!user) {
    return null;
  }

  const userId = user.id;

  function handleAvatarChange(
    nextAvatarUrl: string,
  ) {
    localStorage.setItem(
      `profile-avatar:${userId}`,
      nextAvatarUrl,
    );

    setAvatarUrl(nextAvatarUrl);
  }

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
        <ProfileMenu
          user={user}
          avatarUrl={avatarUrl || getStoredAvatar(userId)}
          onAvatarChange={handleAvatarChange}
          onLogout={logout}
        />
      </div>
    </header>
  );
}