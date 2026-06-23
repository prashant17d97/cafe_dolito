import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PromoState { code: string | null; setCode: (code: string | null) => void; }

export const usePromoStore = create<PromoState>()(
  persist((set) => ({ code: null, setCode: (code) => set({ code }) }), { name: "cd:promo" }),
);
