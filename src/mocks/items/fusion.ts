import type { MenuItem } from "@/types";
import { makeItem, OPTIONS } from "../factory";
import { unsplash, IMG } from "../images";

export const FUSION_ITEMS: MenuItem[] = [
  makeItem({
    name: "Tandoori Chicken Pizza", cuisine: "fusion", categorySlug: "fusion-signatures", price: 17,
    description: "Wood-fired Napoletana base, tandoori chicken, red onion, mint-yogurt drizzle.",
    images: [{ src: unsplash(IMG.fusion), alt: "Tandoori chicken pizza" }],
    options: [OPTIONS.spiceChoice], dietary: ["spicy", "chefs-special", "bestseller"], spice: 2,
    collectionSlugs: ["the-fusion-table"],
    rating: 4.8, reviewCount: 318,
  }),
  makeItem({
    name: "Butter-Chicken Risotto", cuisine: "fusion", categorySlug: "fusion-signatures", price: 19,
    description: "Carnaroli rice slow-stirred in a makhani cream, charred chicken, kasuri methi.",
    images: [{ src: unsplash(IMG.risotto), alt: "Butter chicken risotto" }],
    options: [OPTIONS.spiceChoice], dietary: ["chefs-special"], spice: 2,
    collectionSlugs: ["the-fusion-table"],
    rating: 4.9, reviewCount: 176,
  }),
  makeItem({
    name: "Gulab Jamun Tiramisù", cuisine: "fusion", type: "food", categorySlug: "fusion-signatures", price: 9,
    description: "Mascarpone, espresso-soaked savoiardi, cardamom gulab jamun.",
    images: [{ src: unsplash(IMG.tiramisu), alt: "Gulab jamun tiramisu" }],
    dietary: ["veg", "new"], veg: true, collectionSlugs: ["the-fusion-table"],
    rating: 4.7, reviewCount: 48,
  }),
  makeItem({
    name: "Masala Arrabbiata Penne", cuisine: "fusion", categorySlug: "fusion-signatures", price: 16,
    description: "Penne in a fiery tomato sauce spiked with garam masala, curry leaves and chilli.",
    images: [{ src: unsplash(IMG.pasta), alt: "Masala arrabbiata penne" }],
    options: [OPTIONS.spiceChoice], dietary: ["vegan", "spicy", "chefs-special"], veg: true, spice: 2,
    collectionSlugs: ["the-fusion-table"],
    rating: 4.6, reviewCount: 127,
  }),
  makeItem({
    name: "Paneer Lasagna", cuisine: "fusion", categorySlug: "fusion-signatures", price: 18,
    description: "Layers of egg pasta, spiced palak-paneer filling and smoked mozzarella béchamel.",
    images: [{ src: unsplash(IMG.fusion), alt: "Paneer lasagna" }],
    options: [OPTIONS.spiceChoice], dietary: ["veg", "new"], veg: true, spice: 1,
    collectionSlugs: ["the-fusion-table"],
    rating: 4.5, reviewCount: 39,
  }),
  makeItem({
    name: "Tikka Pesto Penne", cuisine: "fusion", categorySlug: "fusion-signatures", price: 17,
    description: "Creamy tikka masala sauce blended with basil pesto, tossed with char-grilled chicken.",
    images: [{ src: unsplash(IMG.pasta), alt: "Tikka pesto penne" }],
    options: [OPTIONS.spiceChoice], dietary: ["bestseller", "chefs-special"], spice: 1,
    collectionSlugs: ["the-fusion-table"],
    rating: 4.7, reviewCount: 243,
  }),
  makeItem({
    name: "Keema Bolognese", cuisine: "fusion", categorySlug: "fusion-signatures", price: 18,
    description: "Spiced minced lamb in a slow-cooked tomato-cinnamon-cardamom ragu on tagliatelle.",
    images: [{ src: unsplash(IMG.pasta), alt: "Keema bolognese" }],
    options: [OPTIONS.spiceChoice], dietary: ["halal", "chefs-special"], spice: 1,
    collectionSlugs: ["the-fusion-table"],
    rating: 4.4, reviewCount: 65,
  }),
  makeItem({
    name: "Masala Chai Affogato", cuisine: "fusion", type: "drink", categorySlug: "fusion-signatures", price: 7.5,
    description: "A scoop of vanilla kulfi drowned in hot masala chai espresso concentrate.",
    images: [{ src: unsplash(IMG.espresso), alt: "Masala chai affogato" }],
    dietary: ["veg", "new", "chefs-special"], veg: true,
    collectionSlugs: ["the-fusion-table"],
    rating: 4.8, reviewCount: 83,
  }),
  makeItem({
    name: "Chai Panna Cotta", cuisine: "fusion", categorySlug: "fusion-signatures", price: 8,
    description: "Italian set cream infused with masala chai spices, served with caramel and pistachios.",
    images: [{ src: unsplash(IMG.tiramisu), alt: "Chai panna cotta" }],
    dietary: ["veg", "seasonal", "contains-nuts"], veg: true, collectionSlugs: ["the-fusion-table", "seasonal"],
    rating: 4.6, reviewCount: 57,
  }),
];
