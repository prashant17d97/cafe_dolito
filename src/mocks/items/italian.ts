import type { MenuItem } from "@/types";
import { makeItem } from "../factory";
import { unsplash, IMG } from "../images";

export const ITALIAN_ITEMS: MenuItem[] = [
  // Antipasti
  makeItem({
    name: "Bruschetta al Pomodoro", cuisine: "italian", categorySlug: "antipasti", price: 8,
    description: "Grilled sourdough rubbed with garlic, topped with heirloom tomatoes, basil and Sicilian olive oil.",
    images: [{ src: unsplash(IMG.gallery1), alt: "Bruschetta" }],
    dietary: ["vegan", "chefs-special"], veg: true, collectionSlugs: ["italian-classics"],
    rating: 4.6, reviewCount: 98,
  }),
  makeItem({
    name: "Burrata e Prosciutto", cuisine: "italian", categorySlug: "antipasti", price: 14,
    description: "Creamy burrata from Puglia with San Daniele prosciutto, fig jam and rocket.",
    images: [{ src: unsplash(IMG.gallery2), alt: "Burrata with prosciutto" }],
    dietary: ["chefs-special"], collectionSlugs: ["italian-classics"],
    rating: 4.9, reviewCount: 143,
  }),
  makeItem({
    name: "Calamari Fritti", cuisine: "italian", categorySlug: "antipasti", price: 12,
    description: "Lightly dusted squid rings fried golden, served with lemon aioli and chilli.",
    images: [{ src: unsplash(IMG.gallery1), alt: "Calamari fritti" }],
    dietary: ["bestseller"], collectionSlugs: ["italian-classics"],
    rating: 4.5, reviewCount: 217,
  }),
  // Pasta
  makeItem({
    name: "Spaghetti Cacio e Pepe", cuisine: "italian", categorySlug: "pasta", price: 16,
    description: "Roman simplicity: Pecorino Romano, Parmigiano, and cracked black pepper.",
    images: [{ src: unsplash(IMG.pasta), alt: "Cacio e pepe pasta" }],
    dietary: ["veg", "bestseller"], veg: true, collectionSlugs: ["italian-classics"],
    rating: 4.8, reviewCount: 304,
  }),
  makeItem({
    name: "Pappardelle al Ragù", cuisine: "italian", categorySlug: "pasta", price: 19,
    description: "Slow-braised beef and pork ragù over wide egg pappardelle, finished with Parmigiano.",
    images: [{ src: unsplash(IMG.pasta), alt: "Pappardelle with ragu" }],
    dietary: ["bestseller", "chefs-special"], collectionSlugs: ["italian-classics"],
    rating: 4.9, reviewCount: 389,
  }),
  makeItem({
    name: "Linguine alle Vongole", cuisine: "italian", categorySlug: "pasta", price: 21,
    description: "Fresh clams steamed in white wine with garlic, chilli and flat-leaf parsley.",
    images: [{ src: unsplash(IMG.pasta), alt: "Linguine alle vongole" }],
    dietary: ["seasonal"], collectionSlugs: ["italian-classics"],
    rating: 4.7, reviewCount: 56,
  }),
  makeItem({
    name: "Rigatoni all'Arrabbiata", cuisine: "italian", categorySlug: "pasta", price: 15,
    description: "Rigatoni in a fiery tomato-garlic-chilli sauce with fresh basil.",
    images: [{ src: unsplash(IMG.pasta), alt: "Rigatoni arrabbiata" }],
    dietary: ["vegan", "spicy"], veg: true, spice: 2, collectionSlugs: ["italian-classics"],
    rating: 4.3, reviewCount: 112,
  }),
  // Pizza
  makeItem({
    name: "Margherita Classica", cuisine: "italian", categorySlug: "pizza", price: 15,
    description: "San Marzano tomato, fior di latte, fresh basil — the original, perfected.",
    images: [{ src: unsplash(IMG.pizza), alt: "Margherita pizza" }],
    dietary: ["veg", "bestseller"], veg: true, collectionSlugs: ["italian-classics"],
    rating: 4.6, reviewCount: 420,
  }),
  makeItem({
    name: "Diavola", cuisine: "italian", categorySlug: "pizza", price: 17,
    description: "Spicy Calabrian salami, tomato, fior di latte and a drizzle of chilli oil.",
    images: [{ src: unsplash(IMG.pizza), alt: "Diavola pizza" }],
    dietary: ["spicy", "bestseller"], spice: 2, collectionSlugs: ["italian-classics"],
    rating: 4.7, reviewCount: 287,
  }),
  makeItem({
    name: "Tartufo e Funghi", cuisine: "italian", categorySlug: "pizza", price: 20,
    description: "Black truffle, mixed wild mushrooms, fontina and thyme on a white base.",
    images: [{ src: unsplash(IMG.pizza), alt: "Truffle mushroom pizza" }],
    dietary: ["veg", "chefs-special", "seasonal"], veg: true, collectionSlugs: ["italian-classics"],
    rating: 4.8, reviewCount: 74,
  }),
  // Risotto
  makeItem({
    name: "Risotto ai Funghi Porcini", cuisine: "italian", categorySlug: "risotto", price: 18,
    description: "Carnaroli rice with dried and fresh porcini, white wine and Parmigiano Reggiano.",
    images: [{ src: unsplash(IMG.risotto), alt: "Porcini risotto" }],
    dietary: ["veg", "chefs-special", "gluten-free"], veg: true, collectionSlugs: ["italian-classics"],
    rating: 4.9, reviewCount: 161,
  }),
  // Dolci
  makeItem({
    name: "Tiramisù Classico", cuisine: "italian", categorySlug: "dolci", price: 9,
    description: "Classic mascarpone cream, espresso-dipped savoiardi, cocoa — made fresh daily.",
    images: [{ src: unsplash(IMG.tiramisu), alt: "Classic tiramisu" }],
    dietary: ["veg", "bestseller"], veg: true, collectionSlugs: ["italian-classics"],
    rating: 4.8, reviewCount: 352,
  }),
  makeItem({
    name: "Panna Cotta al Pistacchio", cuisine: "italian", categorySlug: "dolci", price: 8,
    description: "Set cream with Bronte pistachio paste and a raspberry coulis.",
    images: [{ src: unsplash(IMG.tiramisu), alt: "Panna cotta" }],
    dietary: ["veg", "new", "contains-nuts"], veg: true, collectionSlugs: ["italian-classics"],
    rating: 4.5, reviewCount: 33,
  }),
];
