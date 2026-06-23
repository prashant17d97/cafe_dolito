import type { MenuItem, Paginated, ProductQuery } from "@/types";
import { ITEMS, getItem } from "@/mocks/items";
import { filterItems, sortItems, paginate, DEFAULT_PAGE_SIZE } from "@/lib/menu-query";
import { buildFacets } from "@/lib/facets";
import { withDelay } from "./delay";

export const menuService = {
  async list(query: ProductQuery): Promise<Paginated<MenuItem>> {
    const filtered = sortItems(filterItems(ITEMS, query), query.sort);
    return withDelay(paginate(filtered, query.page ?? 1, DEFAULT_PAGE_SIZE));
  },
  async getBySlug(slug: string): Promise<MenuItem | undefined> {
    return withDelay(getItem(slug));
  },
  async byCategory(slug: string): Promise<MenuItem[]> {
    return withDelay(ITEMS.filter((i) => i.categorySlug === slug));
  },
  async facets() {
    return withDelay(buildFacets(ITEMS));
  },
};
