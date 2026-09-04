import {
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { DevTools } from "../dev/DevTools";

export function AppShell({
  children,
}: PropsWithChildren) {
  const [isMobileNavOpen, setIsMobileNavOpen] =
    useState(false);

  function openMobileNav() {
    setIsMobileNavOpen(true);
  }

  function closeMobileNav() {
    setIsMobileNavOpen(false);
  }

  useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMobileNav();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isMobileNavOpen]);

  return (
    <div className="app-shell">
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={closeMobileNav}
      />

      {isMobileNavOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={closeMobileNav}
        />
      )}

      <div className="app-main">
        <Header onOpenNavigation={openMobileNav} />

        <main className="app-content">
          {children}
        </main>
      </div>
      <DevTools />
    </div>
  );
}