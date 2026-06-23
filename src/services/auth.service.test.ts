import { describe, expect, it, beforeEach } from "vitest";
import { authService, AuthError } from "./auth";
import { DEMO_CREDENTIALS } from "@/mocks/users";

describe("authService", () => {
  beforeEach(() => localStorage.clear());
  it("logs in the demo user", async () => {
    const user = await authService.login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    expect(user.email).toBe(DEMO_CREDENTIALS.email);
    expect((user as unknown as { password?: string }).password).toBeUndefined();
  });
  it("rejects a bad password", async () => {
    await expect(authService.login(DEMO_CREDENTIALS.email, "wrong")).rejects.toBeInstanceOf(AuthError);
  });
  it("registers a new user", async () => {
    const user = await authService.register({ firstName: "A", lastName: "B", email: "a@b.com", password: "password123" });
    expect(user.email).toBe("a@b.com");
  });
  it("rejects duplicate email on register", async () => {
    await expect(
      authService.register({ firstName: "X", lastName: "Y", email: DEMO_CREDENTIALS.email, password: "password123" }),
    ).rejects.toBeInstanceOf(AuthError);
  });
  it("register returns a session user without a password", async () => {
    const user = await authService.register({ firstName: "C", lastName: "D", email: "c@d.com", password: "password123" });
    expect((user as unknown as { password?: string }).password).toBeUndefined();
  });
});
