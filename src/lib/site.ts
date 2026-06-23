import type { Hours } from "@/types";

// Sun..Sat. Café opens daily 7:00; closes 22:00 (Fri/Sat 23:00).
export const HOURS: Hours = [
  { open: "07:00", close: "22:00" }, // Sun
  { open: "07:00", close: "22:00" }, // Mon
  { open: "07:00", close: "22:00" }, // Tue
  { open: "07:00", close: "22:00" }, // Wed
  { open: "07:00", close: "22:00" }, // Thu
  { open: "07:00", close: "23:00" }, // Fri
  { open: "08:00", close: "23:00" }, // Sat
];

export const SITE = {
  name: "Café Dolitó",
  tagline: "Slow-roasted coffee. Italy & India, one table.",
  description:
    "Specialty coffee café and kitchen — authentic Italian, Indian, and Italian-in-Indian-style fusion.",
  url: "https://cafedolito.example",
  email: "hello@cafedolito.example",
  phone: "+1 (503) 555-0142",
  address: { line1: "27 Almond Row", city: "Portland", state: "OR", zip: "97204" },
  currency: "USD",
  hours: HOURS,
  socials: {
    instagram: "https://instagram.com/cafedolito",
    facebook: "https://facebook.com/cafedolito",
    tiktok: "https://tiktok.com/@cafedolito",
  },
} as const;

export const MAIN_NAV = [
  { label: "Menu", href: "/menu" },
  { label: "The Fusion Table", href: "/collections/the-fusion-table" },
  { label: "Reserve", href: "/reserve" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Visit", href: "/visit" },
] as const;

export const FOOTER_LINKS = {
  Explore: [
    { label: "Menu", href: "/menu" },
    { label: "Collections", href: "/collections" },
    { label: "Reserve a table", href: "/reserve" },
    { label: "Private events", href: "/events" },
  ],
  Company: [
    { label: "Our story", href: "/about" },
    { label: "Visit us", href: "/visit" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  Legal: [
    { label: "Privacy", href: "/policies/privacy" },
    { label: "Terms", href: "/policies/terms" },
    { label: "Allergens & dietary", href: "/policies/allergens" },
  ],
} as const;
