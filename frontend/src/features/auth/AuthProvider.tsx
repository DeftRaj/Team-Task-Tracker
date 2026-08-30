import { useState, type PropsWithChildren, } from "react";

import { authService } from "../../services/authService";
import type { User } from "../../types/user";
import { AuthContext } from "./AuthContext";
import type { SignInCredentials } from "./auth.types";

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const initialSession = authService.getSession();

  const [user, setUser] = useState<User | null>(
    initialSession?.user ?? null,
  );

  async function signIn(credentials: SignInCredentials) {
    const session = await authService.signIn(credentials);

    setUser(session.user);
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        signIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}