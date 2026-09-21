export interface TourScene {
  /** DOM id — also the rail anchor target. */
  id: string;
  /** Short name, used by the rail's screen-reader label. */
  label: string;
  /** Small mono line above the heading. */
  eyebrow: string;
  title: string;
  body: string;
}

/**
 * The five scenes of the café tour, in scroll order.
 * Scene 1 carries the page's only <h1>; its eyebrow keeps the brand/SEO
 * line inherited from the retired hero.
 */
export const TOUR_SCENES: readonly TourScene[] = [
  {
    id: "door",
    label: "The door",
    eyebrow: "Specialty coffee · Italian · Indian · Fusion",
    title: "Italy & India, over coffee.",
    body: "Slow-roasted single-origin blends. Handmade pasta. Cardamom chai. All in one warm corner of the city.",
  },
  {
    id: "roast",
    label: "The counter",
    eyebrow: "02 — The counter",
    title: "We roast it ten steps from your cup.",
    body: "Green beans go into the drum most mornings before service. You can smell which day it was the moment the door swings shut behind you.",
  },
  {
    id: "bar",
    label: "The bar",
    eyebrow: "03 — The bar",
    title: "Then somebody pulls it, properly.",
    body: "Twenty-five seconds, a hair over ninety-two degrees, and a crema the colour of hazelnut skin. No syrups hiding anything.",
  },
  {
    id: "kitchen",
    label: "The kitchen",
    eyebrow: "04 — The kitchen",
    title: "Two stoves. One pass.",
    body: "A Neapolitan baker on one side, a tandoor on the other. They started swapping ingredients across the pass, and the fusion table was born.",
  },
  {
    id: "table",
    label: "The table",
    eyebrow: "05 — The table",
    title: "It all arrives at one table.",
    body: "One long oak table, plates in the middle, nobody standing on ceremony. Pull out a chair.",
  },
];

/** Stable module-level id list — pass this to useActiveScene. */
export const TOUR_SCENE_IDS: readonly string[] = TOUR_SCENES.map((s) => s.id);
