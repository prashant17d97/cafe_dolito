/** Build a sized Unsplash URL from a photo id. */
export function unsplash(id: string, w = 1200): string {
  return `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
}

// Curated coffee/Italian/Indian photo ids (swap freely — single source of truth).
export const IMG = {
  beans: "photo-1559056199-641a0ac8b55e",
  espresso: "photo-1510707577719-ae7c14805e3a",
  latte: "photo-1541167760496-1628856ab772",
  coldBrew: "photo-1461023058943-07fcbe16d735",
  pasta: "photo-1473093295043-cdd812d0e601",
  pizza: "photo-1513104890138-7c749659a591",
  risotto: "photo-1476124369491-e7addf5db371",
  tiramisu: "photo-1571877227200-a0d98ea607e9",
  curry: "photo-1631452180519-c014fe946bc7",
  biryani: "photo-1563379091339-03b21ab4a4f8",
  tandoor: "photo-1599487488170-d11ec9c172f0",
  chaat: "photo-1606491956689-2ea866880c84",
  naan: "photo-1601050690597-df0568f70950",
  fusion: "photo-1565299624946-b28f40a0ae38",
  interior: "photo-1554118811-1e0d58224f24",
  gallery1: "photo-1442512595331-e89e73853f31",
  gallery2: "photo-1521017432531-fbd92d768814",
} as const;

/** Inline SVG fallback (used if a remote image fails). */
export const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900'><rect width='100%' height='100%' fill='%23e7d2b6'/></svg>`,
  );
