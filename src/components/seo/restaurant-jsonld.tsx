import { SITE } from "@/lib/site";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function RestaurantJsonLd() {
  const openingHours = SITE.hours
    .map((h, i) => (h ? { "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[i], opens: h.open, closes: h.close } : null))
    .filter(Boolean);

  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    servesCuisine: ["Coffee", "Italian", "Indian", "Fusion"],
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.line1,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: openingHours,
    acceptsReservations: true,
    sameAs: Object.values(SITE.socials),
  };

  return (
    <script
      type="application/ld+json"
      // Static, trusted data — safe to inline as structured data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
