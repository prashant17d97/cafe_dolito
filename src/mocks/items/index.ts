import type { MenuItem } from "@/types";
import { CAFE_ITEMS } from "./cafe";
import { ITALIAN_ITEMS } from "./italian";
import { INDIAN_ITEMS } from "./indian";
import { FUSION_ITEMS } from "./fusion";
import { BEAN_ITEMS } from "./beans";

export const ITEMS: MenuItem[] = [
  ...CAFE_ITEMS, ...ITALIAN_ITEMS, ...INDIAN_ITEMS, ...FUSION_ITEMS, ...BEAN_ITEMS,
];

export function getItem(slug: string): MenuItem | undefined {
  return ITEMS.find((i) => i.slug === slug);
}
