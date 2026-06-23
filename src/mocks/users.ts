import type { MockUser } from "@/types";

export const DEMO_CREDENTIALS = { email: "demo@cafedolito.com", password: "password123" } as const;

export const SEED_USERS: MockUser[] = [
  { id: "u1", firstName: "Demo", lastName: "Guest", email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password },
];
