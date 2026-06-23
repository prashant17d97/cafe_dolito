import type { MenuItem } from "@/types";
import { makeItem, OPTIONS } from "../factory";
import { unsplash, IMG } from "../images";

export const INDIAN_ITEMS: MenuItem[] = [
  // Chaat & Street
  makeItem({
    name: "Pani Puri", cuisine: "indian", categorySlug: "chaat-street", price: 7,
    description: "Crispy semolina puris filled with spiced potato and dunked in tangy tamarind-mint water.",
    images: [{ src: unsplash(IMG.chaat), alt: "Pani puri" }],
    dietary: ["veg", "vegan", "bestseller"], veg: true, spice: 1,
    collectionSlugs: ["indian-soul"],
    rating: 4.7, reviewCount: 198,
  }),
  makeItem({
    name: "Dahi Bhalla Chaat", cuisine: "indian", categorySlug: "chaat-street", price: 8,
    description: "Soft lentil dumplings bathed in whipped yogurt, date-tamarind chutney and sev.",
    images: [{ src: unsplash(IMG.chaat), alt: "Dahi bhalla chaat" }],
    dietary: ["veg", "bestseller"], veg: true, spice: 1, collectionSlugs: ["indian-soul"],
    rating: 4.6, reviewCount: 163,
  }),
  makeItem({
    name: "Aloo Tikki Chaat", cuisine: "indian", categorySlug: "chaat-street", price: 8,
    description: "Pan-fried spiced potato cakes topped with chickpea masala, yogurt and chutneys.",
    images: [{ src: unsplash(IMG.chaat), alt: "Aloo tikki chaat" }],
    dietary: ["veg"], veg: true, spice: 1, collectionSlugs: ["indian-soul"],
    rating: 4.4, reviewCount: 87,
  }),
  // Curries
  makeItem({
    name: "Butter Chicken", cuisine: "indian", categorySlug: "curries", price: 17,
    description: "Tender tandoori chicken thighs in a rich, velvety tomato-cream-butter sauce.",
    images: [{ src: unsplash(IMG.curry), alt: "Butter chicken" }],
    options: [OPTIONS.spiceChoice], dietary: ["halal", "bestseller"], spice: 1,
    collectionSlugs: ["indian-soul"],
    rating: 4.8, reviewCount: 384,
  }),
  makeItem({
    name: "Dal Makhani", cuisine: "indian", categorySlug: "curries", price: 14,
    description: "Black lentils and kidney beans slow-cooked overnight in tomato, butter and cream.",
    images: [{ src: unsplash(IMG.curry), alt: "Dal makhani" }],
    options: [OPTIONS.spiceChoice], dietary: ["veg", "bestseller"], veg: true, spice: 1,
    collectionSlugs: ["indian-soul"],
    rating: 4.7, reviewCount: 256,
  }),
  makeItem({
    name: "Palak Paneer", cuisine: "indian", categorySlug: "curries", price: 15,
    description: "House-made paneer cubes in a smooth, spiced spinach sauce.",
    images: [{ src: unsplash(IMG.curry), alt: "Palak paneer" }],
    options: [OPTIONS.spiceChoice], dietary: ["veg", "gluten-free"], veg: true, spice: 1,
    collectionSlugs: ["indian-soul"],
    rating: 4.5, reviewCount: 119,
  }),
  makeItem({
    name: "Lamb Rogan Josh", cuisine: "indian", categorySlug: "curries", price: 19,
    description: "Kashmiri-style slow-braised lamb with aromatic whole spices and Kashmiri chilli.",
    images: [{ src: unsplash(IMG.curry), alt: "Rogan josh" }],
    options: [OPTIONS.spiceChoice], dietary: ["halal", "chefs-special", "gluten-free"], spice: 2,
    collectionSlugs: ["indian-soul"],
    rating: 4.9, reviewCount: 207,
  }),
  // Tandoor
  makeItem({
    name: "Chicken Tikka", cuisine: "indian", categorySlug: "tandoor", price: 16,
    description: "Boneless chicken marinated overnight in spiced yogurt, char-grilled in the tandoor.",
    images: [{ src: unsplash(IMG.tandoor), alt: "Chicken tikka" }],
    options: [OPTIONS.spiceChoice], dietary: ["halal", "bestseller", "gluten-free"], spice: 2,
    collectionSlugs: ["indian-soul"],
    rating: 4.8, reviewCount: 331,
  }),
  makeItem({
    name: "Seekh Kebab", cuisine: "indian", categorySlug: "tandoor", price: 15,
    description: "Minced lamb with ginger, coriander and green chilli skewered and grilled.",
    images: [{ src: unsplash(IMG.tandoor), alt: "Seekh kebab" }],
    options: [OPTIONS.spiceChoice], dietary: ["halal", "gluten-free"], spice: 2,
    collectionSlugs: ["indian-soul"],
    rating: 4.6, reviewCount: 94,
  }),
  makeItem({
    name: "Paneer Tikka", cuisine: "indian", categorySlug: "tandoor", price: 14,
    description: "Thick-cut cottage cheese marinated in ajwain-yogurt and grilled until smoky.",
    images: [{ src: unsplash(IMG.tandoor), alt: "Paneer tikka" }],
    options: [OPTIONS.spiceChoice], dietary: ["veg", "gluten-free"], veg: true, spice: 1,
    collectionSlugs: ["indian-soul"],
    rating: 4.4, reviewCount: 108,
  }),
  // Biryani
  makeItem({
    name: "Hyderabadi Dum Biryani", cuisine: "indian", categorySlug: "biryani", price: 20,
    description: "Aged basmati layered with slow-cooked mutton and sealed with dough, dum-cooked.",
    images: [{ src: unsplash(IMG.biryani), alt: "Hyderabadi biryani" }],
    options: [OPTIONS.spiceChoice], dietary: ["halal", "bestseller", "chefs-special", "gluten-free"], spice: 2,
    collectionSlugs: ["indian-soul"],
    rating: 4.9, reviewCount: 416,
  }),
  makeItem({
    name: "Vegetable Dum Biryani", cuisine: "indian", categorySlug: "biryani", price: 16,
    description: "Seasonal vegetables and saffron-scented basmati sealed and dum-cooked.",
    images: [{ src: unsplash(IMG.biryani), alt: "Vegetable biryani" }],
    options: [OPTIONS.spiceChoice], dietary: ["veg", "gluten-free"], veg: true, spice: 1,
    collectionSlugs: ["indian-soul"],
    rating: 4.3, reviewCount: 72,
  }),
  // Breads
  makeItem({
    name: "Garlic Butter Naan", cuisine: "indian", categorySlug: "breads", price: 4,
    description: "Leavened naan slathered with garlic butter and fresh coriander from the tandoor.",
    images: [{ src: unsplash(IMG.naan), alt: "Garlic naan" }],
    dietary: ["veg", "bestseller"], veg: true, collectionSlugs: ["indian-soul"],
    rating: 4.5, reviewCount: 188,
  }),
  makeItem({
    name: "Laccha Paratha", cuisine: "indian", categorySlug: "breads", price: 4,
    description: "Whole-wheat flaky layered bread cooked on a tawa with a touch of ghee.",
    images: [{ src: unsplash(IMG.naan), alt: "Laccha paratha" }],
    dietary: ["veg"], veg: true, collectionSlugs: ["indian-soul"],
    rating: 4.2, reviewCount: 53,
  }),
  // Mithai
  makeItem({
    name: "Gulab Jamun", cuisine: "indian", categorySlug: "mithai", price: 6,
    description: "Milk-solid dumplings soaked in rose-saffron syrup, served warm.",
    images: [{ src: unsplash(IMG.tiramisu), alt: "Gulab jamun" }],
    dietary: ["veg", "bestseller"], veg: true, collectionSlugs: ["indian-soul"],
    rating: 4.7, reviewCount: 275,
  }),
  makeItem({
    name: "Kulfi Falooda", cuisine: "indian", categorySlug: "mithai", price: 8,
    description: "Dense saffron-pistachio kulfi over chilled rose falooda and basil seeds.",
    images: [{ src: unsplash(IMG.tiramisu), alt: "Kulfi falooda" }],
    dietary: ["veg", "seasonal", "contains-nuts"], veg: true, collectionSlugs: ["seasonal"],
    rating: 4.6, reviewCount: 88,
  }),
];
