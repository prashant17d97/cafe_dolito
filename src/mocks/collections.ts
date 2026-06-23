import type { Collection } from "@/types";
import { unsplash, IMG } from "./images";

export const COLLECTIONS: Collection[] = [
  { slug: "the-fusion-table", name: "The Fusion Table", tagline: "Italian, cooked in Indian style.", image: unsplash(IMG.fusion), itemIds: [] },
  { slug: "italian-classics", name: "Italian Classics", tagline: "From Napoli, with love.", image: unsplash(IMG.pasta), itemIds: [] },
  { slug: "indian-soul", name: "Indian Soul", tagline: "Spice, smoke and comfort.", image: unsplash(IMG.curry), itemIds: [] },
  { slug: "roasters-picks", name: "Roaster's Picks", tagline: "Beans for home.", image: unsplash(IMG.beans), itemIds: [] },
  { slug: "seasonal", name: "Seasonal", tagline: "Right now, only.", image: unsplash(IMG.latte), itemIds: [] },
];
