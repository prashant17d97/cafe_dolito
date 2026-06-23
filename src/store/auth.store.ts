import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionUser } from "@/types";
import { authService } from "@/services/auth";

type AuthStatus = "idle" | "authenticated";

interface AuthState {
  user: SessionUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "idle",
      login: async (email, password) => {
        const user = await authService.login(email, password);
        set({ user, status: "authenticated" });
      },
      register: async (input) => {
        const user = await authService.register(input);
        set({ user, status: "authenticated" });
      },
      logout: () => set({ user: null, status: "idle" }),
    }),
    { name: "cd:auth", partialize: (s) => ({ user: s.user }) },
  ),
);
