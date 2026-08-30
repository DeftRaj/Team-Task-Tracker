import { DEMO_CREDENTIALS } from "../features/auth/auth.constants";
import type {
  AuthSession,
  SignInCredentials,
} from "../features/auth/auth.types";

const SESSION_KEY = "team-task-tracker-session";

const demoUser = {
  id: "user-1",
  name: "Demo User",
  email: DEMO_CREDENTIALS.email,
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  async signIn(
    credentials: SignInCredentials,
  ): Promise<AuthSession> {
    await wait(700);

    const isValid =
      credentials.email === DEMO_CREDENTIALS.email &&
      credentials.password === DEMO_CREDENTIALS.password;

    if (!isValid) {
      throw new Error("Invalid email or password.");
    }

    const session: AuthSession = {
      user: demoUser,
    };

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    );

    return session;
  },

  getSession(): AuthSession | null {
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (!storedSession) {
      return null;
    }

    try {
      return JSON.parse(storedSession) as AuthSession;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
};