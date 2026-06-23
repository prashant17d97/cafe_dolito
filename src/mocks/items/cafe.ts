import type { MenuItem } from "@/types";
import { makeItem, OPTIONS } from "../factory";
import { unsplash, IMG } from "../images";

export const CAFE_ITEMS: MenuItem[] = [
  makeItem({
    name: "Doppio Espresso", cuisine: "cafe", type: "drink", categorySlug: "espresso", price: 3.5,
    description: "Two ristretto shots of our small-batch house roast, pulled at 9 bar.",
    images: [{ src: unsplash(IMG.espresso), alt: "Espresso in a ceramic cup" }],
    options: [OPTIONS.drinkSize], dietary: ["vegan", "bestseller"], collectionSlugs: ["roasters-picks"],
  }),
  makeItem({
    name: "Macchiato", cuisine: "cafe", type: "drink", categorySlug: "espresso", price: 3.8,
    description: "A single espresso 'stained' with a dollop of silky micro-foam.",
    images: [{ src: unsplash(IMG.espresso), alt: "Macchiato" }],
    options: [OPTIONS.drinkSize], dietary: ["veg"],
  }),
  makeItem({
    name: "Flat White", cuisine: "cafe", type: "drink", categorySlug: "espresso", price: 4.2,
    description: "Double ristretto, velvety steamed milk — the antipodean way.",
    images: [{ src: unsplash(IMG.latte), alt: "Flat white" }],
    options: [OPTIONS.drinkSize, OPTIONS.milk], dietary: ["veg", "bestseller"],
  }),
  makeItem({
    name: "Cardamom Rose Latte", cuisine: "cafe", type: "drink", categorySlug: "signature-lattes", price: 5.5,
    description: "Espresso, steamed milk, green cardamom and a whisper of rose water.",
    images: [{ src: unsplash(IMG.latte), alt: "Latte with latte art" }],
    options: [OPTIONS.drinkSize, OPTIONS.milk], dietary: ["veg", "chefs-special"], collectionSlugs: ["seasonal"],
  }),
  makeItem({
    name: "Saffron Honey Latte", cuisine: "cafe", type: "drink", categorySlug: "signature-lattes", price: 5.8,
    description: "Golden saffron threads steeped in warm milk, finished with wildflower honey and espresso.",
    images: [{ src: unsplash(IMG.latte), alt: "Saffron latte" }],
    options: [OPTIONS.drinkSize, OPTIONS.milk], dietary: ["veg", "new"], collectionSlugs: ["seasonal"],
  }),
  makeItem({
    name: "Coconut Cold Brew", cuisine: "cafe", type: "drink", categorySlug: "cold-brew", price: 5.0,
    description: "18-hour cold-steeped concentrate poured over ice with coconut water.",
    images: [{ src: unsplash(IMG.coldBrew), alt: "Cold brew in a glass" }],
    options: [OPTIONS.drinkSize], dietary: ["vegan", "bestseller"],
  }),
  makeItem({
    name: "Nitro Cold Brew", cuisine: "cafe", type: "drink", categorySlug: "cold-brew", price: 5.5,
    description: "Nitrogen-infused cold brew on tap — creamy, cascading, zero sugar.",
    images: [{ src: unsplash(IMG.coldBrew), alt: "Nitro cold brew" }],
    options: [], dietary: ["vegan", "new"],
  }),
  makeItem({
    name: "Masala Chai", cuisine: "cafe", type: "drink", categorySlug: "tea-not-coffee", price: 4.0,
    description: "Assam tea simmered with ginger, cinnamon, cardamom and black pepper, steamed with whole milk.",
    images: [{ src: unsplash(IMG.latte), alt: "Masala chai" }],
    options: [OPTIONS.drinkSize, OPTIONS.milk], dietary: ["veg", "bestseller"],
  }),
  makeItem({
    name: "Matcha Oat Latte", cuisine: "cafe", type: "drink", categorySlug: "tea-not-coffee", price: 5.2,
    description: "Ceremonial-grade matcha whisked with oat milk — earthy, smooth, calming.",
    images: [{ src: unsplash(IMG.latte), alt: "Matcha latte" }],
    options: [OPTIONS.drinkSize, OPTIONS.milk], dietary: ["vegan", "seasonal"],
  }),
];
