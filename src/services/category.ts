import type { Category } from "@/types";
import { CATEGORIES } from "@/mocks/categories";
import { withDelay } from "./delay";

export const categoryService = {
  list: () => withDelay(CATEGORIES),
  get: (slug: string): Promise<Category | undefined> => withDelay(CATEGORIES.find((c) => c.slug === slug)),
};
