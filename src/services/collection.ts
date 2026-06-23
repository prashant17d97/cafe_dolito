import type { Collection, MenuItem } from "@/types";
import { COLLECTIONS } from "@/mocks/collections";
import { ITEMS } from "@/mocks/items";
import { withDelay } from "./delay";

function resolve(c: Collection): Collection & { items: MenuItem[] } {
  return { ...c, items: ITEMS.filter((i) => i.collectionSlugs.includes(c.slug)) };
}

export const collectionService = {
  list: () => withDelay(COLLECTIONS.map(resolve)),
  get: (slug: string) => withDelay(COLLECTIONS.filter((c) => c.slug === slug).map(resolve)[0]),
};
