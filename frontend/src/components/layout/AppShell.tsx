import type { PropsWithChildren } from "react";

import { Sidebar } from "./Sidebar.tsx";
import { Header } from "./Header.tsx";

export function AppShell({
  children,
}: PropsWithChildren) {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Header />

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
