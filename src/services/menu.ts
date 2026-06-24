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
  /** All matching items (filtered + sorted), no pagination — for the grouped menu view. */
  async all(query: ProductQuery): Promise<MenuItem[]> {
    return withDelay(sortItems(filterItems(ITEMS, query), query.sort));
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
