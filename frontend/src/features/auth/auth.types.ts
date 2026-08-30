import type { User } from "../../types/user";

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  logout: () => void;
}