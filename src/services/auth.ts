import type { MockUser, SessionUser } from "@/types";
import { SEED_USERS } from "@/mocks/users";
import { readJSON, writeJSON } from "@/lib/storage";
import { withDelay } from "./delay";

const KEY = "cd:users";

export class AuthError extends Error {}

function allUsers(): MockUser[] {
  const extra = readJSON<MockUser[]>(KEY, []);
  return [...SEED_USERS, ...extra];
}
function toSession(u: MockUser): SessionUser {
  return { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email };
}

export const authService = {
  async login(email: string, password: string): Promise<SessionUser> {
    const user = allUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) throw new AuthError("Incorrect email or password.");
    return withDelay(toSession(user), 250);
  },
  async register(input: { firstName: string; lastName: string; email: string; password: string }): Promise<SessionUser> {
    if (allUsers().some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new AuthError("An account with that email already exists.");
    }
    const user: MockUser = { id: `u-${Date.now()}`, ...input };
    writeJSON(KEY, [...readJSON<MockUser[]>(KEY, []), user]);
    return withDelay(toSession(user), 250);
  },
};
