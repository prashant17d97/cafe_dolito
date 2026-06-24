import { IMG, unsplash } from "./images";

export interface Value { title: string; body: string }
export const VALUES: Value[] = [
  { title: "Coffee first", body: "Single-origin beans roasted in small batches, pulled on a lever machine and dialled in every morning. The café is the soul of the house." },
  { title: "Two kitchens, one table", body: "An Italian nonna’s patience and an Indian dadi’s spice box, cooking side by side. We honour both, then let them meet." },
  { title: "Fusion with intent", body: "Not novelty for its own sake — tandoor-smoked paneer in a Neapolitan dough only earns a place if it tastes inevitable." },
  { title: "Seasonal & local", body: "We buy produce from growers we can name, change the specials with the weather, and waste as little as a kitchen can." },
];

export interface GalleryShot { src: string; alt: string; span?: boolean }
export const GALLERY: GalleryShot[] = [
  { src: unsplash(IMG.interior, 1000), alt: "The sunlit café room with marble counters", span: true },
  { src: unsplash(IMG.espresso, 700), alt: "An espresso being pulled" },
  { src: unsplash(IMG.pizza, 700), alt: "A blistered Neapolitan pizza" },
  { src: unsplash(IMG.tandoor, 700), alt: "Skewers in the tandoor" },
  { src: unsplash(IMG.latte, 700), alt: "Latte art in a ceramic cup" },
  { src: unsplash(IMG.pasta, 1000), alt: "Hand-rolled pasta drying", span: true },
  { src: unsplash(IMG.chaat, 700), alt: "A plate of street-style chaat" },
  { src: unsplash(IMG.tiramisu, 700), alt: "A spoon through tiramisù" },
  { src: unsplash(IMG.beans, 700), alt: "Fresh-roasted coffee beans" },
  { src: unsplash(IMG.gallery1, 1000), alt: "Friends sharing a table", span: true },
  { src: unsplash(IMG.curry, 700), alt: "A simmering curry" },
  { src: unsplash(IMG.gallery2, 700), alt: "Warm evening light in the café" },
];

export interface EventOffer { title: string; capacity: string; body: string; image: string }
export const EVENTS: EventOffer[] = [
  { title: "Buyout dinners", capacity: "Up to 60 seated", body: "Take the whole room for a tasting menu that runs Naples to New Delhi, paired with espresso martinis and house chai.", image: unsplash(IMG.interior, 900) },
  { title: "The roastery table", capacity: "8–14 guests", body: "A private cupping and long lunch beside the roaster — for birthdays, teams, or anyone who loves coffee a little too much.", image: unsplash(IMG.beans, 900) },
  { title: "Cook-alongs", capacity: "10–20 guests", body: "Hands-on with our chefs: pull your own pasta, slap dough for the tandoor, and eat everything you make.", image: unsplash(IMG.pasta, 900) },
];

export interface Faq { q: string; a: string }
export const FAQS: Faq[] = [
  { q: "Do I need a reservation?", a: "Walk-ins are always welcome for coffee and the counter. For dinner, especially Friday and Saturday, we recommend booking a table — you can reserve online in under a minute." },
  { q: "What does “Italian in Indian style” actually mean?", a: "It’s our fusion table: Italian technique meeting Indian spice and ingredients — think tandoori-paneer pizza, masala carbonara, or a saffron-pistachio tiramisù. Each dish has to taste deliberate, not gimmicky." },
  { q: "Can you cater to allergies and dietary needs?", a: "Yes. We mark vegetarian, vegan, gluten-free and spicy dishes throughout the menu, and the kitchen can adapt many plates. Tell us in your reservation notes or ask your server." },
  { q: "Are you family friendly?", a: "Very. We have high chairs, a kids’ plate, and a quieter corner for early evenings — just mention it when you book." },
  { q: "Do you roast your own coffee?", a: "We do, in-house in small batches. Bags of whole bean and ground coffee are available to take home, and we restock the single-origin every couple of weeks." },
  { q: "Is there parking?", a: "Street parking is available on Almond Row and the surrounding blocks, and we’re a five-minute walk from the transit mall." },
];

export interface PolicyDoc { title: string; updated: string; intro: string; sections: { heading: string; body: string }[] }
export const POLICIES: Record<string, PolicyDoc> = {
  privacy: {
    title: "Privacy Policy",
    updated: "June 2026",
    intro: "Café Dolitó respects your privacy. This demo site stores everything locally in your browser — no data leaves your device.",
    sections: [
      { heading: "What we collect", body: "When you place an order or book a table, the details you enter (name, contact, order) are saved in your browser’s local storage so the site can remember them. Nothing is transmitted to a server." },
      { heading: "How we use it", body: "Only to show your cart, orders, and reservations back to you within this demo. We don’t share, sell, or sync it anywhere." },
      { heading: "Clearing your data", body: "Clearing your browser’s site data for this domain removes all of it permanently." },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "June 2026",
    intro: "This is a demonstration website. No real transactions, payments, or bookings are processed.",
    sections: [
      { heading: "Demo only", body: "Menus, prices, orders and reservations here are illustrative. No card is charged and no table is actually held." },
      { heading: "Acceptable use", body: "Please use the site for evaluation and enjoyment. Don’t attempt to disrupt or misuse it." },
      { heading: "Liability", body: "The site is provided “as is”, without warranty of any kind." },
    ],
  },
  allergens: {
    title: "Allergens & Dietary",
    updated: "June 2026",
    intro: "We take allergies seriously. Our kitchen handles gluten, dairy, nuts, shellfish and more, so cross-contact is possible.",
    sections: [
      { heading: "On the menu", body: "Dishes are tagged vegetarian, vegan, gluten-free and spicy where they apply. These are guides — always tell us about an allergy directly." },
      { heading: "Talk to us", body: "Note allergies in your reservation or tell your server. The kitchen will advise what’s safe and what can be adapted." },
      { heading: "No guarantees", body: "While we’re careful, we can’t guarantee a dish is entirely free of any allergen given a shared kitchen." },
    ],
  },
};
export const POLICY_SLUGS = Object.keys(POLICIES);
