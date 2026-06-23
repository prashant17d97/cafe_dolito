import { describe, expect, it, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";
import { DEMO_CREDENTIALS } from "@/mocks/users";

const auth = () => useAuthStore.getState();

describe("auth.store", () => {
  beforeEach(() => { localStorage.clear(); useAuthStore.setState({ user: null, status: "idle" }); });
  it("logs in and stores the session user", async () => {
    await auth().login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    expect(auth().user?.email).toBe(DEMO_CREDENTIALS.email);
    expect(auth().status).toBe("authenticated");
  });
  it("logs out", async () => {
    await auth().login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    auth().logout();
    expect(auth().user).toBeNull();
    expect(auth().status).toBe("idle");
  });
});
