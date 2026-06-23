import type { MenuItem } from "@/types";
import { makeItem, OPTIONS } from "../factory";
import { unsplash, IMG } from "../images";

export const BEAN_ITEMS: MenuItem[] = [
  makeItem({
    name: "House Blend Espresso Beans", cuisine: "cafe", type: "bean", categorySlug: "beans", price: 14,
    description: "Our signature house blend: bright Ethiopian Yirgacheffe and smooth Brazilian Cerrado.",
    images: [{ src: unsplash(IMG.beans), alt: "House blend espresso beans" }],
    options: [OPTIONS.weight, OPTIONS.grind], dietary: ["vegan", "bestseller"],
    collectionSlugs: ["roasters-picks"],
    rating: 4.8, reviewCount: 229,
  }),
  makeItem({
    name: "Single Origin Ethiopia Yirgacheffe", cuisine: "cafe", type: "bean", categorySlug: "beans", price: 18,
    description: "Natural-process, jasmine florals, blueberry and apricot — an East African classic.",
    images: [{ src: unsplash(IMG.beans), alt: "Ethiopian Yirgacheffe beans" }],
    options: [OPTIONS.weight, OPTIONS.grind], dietary: ["vegan", "chefs-special"],
    collectionSlugs: ["roasters-picks"],
    rating: 4.9, reviewCount: 117,
  }),
  makeItem({
    name: "Single Origin Colombia Huila", cuisine: "cafe", type: "bean", categorySlug: "beans", price: 17,
    description: "Washed process, red apple, caramel and a clean milk-chocolate finish.",
    images: [{ src: unsplash(IMG.beans), alt: "Colombia Huila beans" }],
    options: [OPTIONS.weight, OPTIONS.grind], dietary: ["vegan"],
    collectionSlugs: ["roasters-picks"],
    rating: 4.6, reviewCount: 81,
  }),
  makeItem({
    name: "Decaf Brazil Swiss Water", cuisine: "cafe", type: "bean", categorySlug: "beans", price: 15,
    description: "Chemical-free Swiss Water process decaf: dark chocolate, toasted hazelnut, full body.",
    images: [{ src: unsplash(IMG.beans), alt: "Decaf Brazil beans" }],
    options: [OPTIONS.weight, OPTIONS.grind], dietary: ["vegan"],
    collectionSlugs: ["roasters-picks"],
    rating: 4.2, reviewCount: 34,
  }),
];
