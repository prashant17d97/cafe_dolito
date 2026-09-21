import { menuService } from "@/services/menu";
import { reviewService } from "@/services/review";
import { Reveal } from "@/components/common/reveal";
import { Tour } from "@/components/home/tour/tour";
import { TrustMarquee } from "@/components/home/trust-marquee";
import { CuisineGrid } from "@/components/home/cuisine-grid";
import { FusionCarousel } from "@/components/home/fusion-carousel";
import { StorySection } from "@/components/home/story-section";
import { SeasonalBanner } from "@/components/home/seasonal-banner";
import { Testimonials } from "@/components/home/testimonials";
import { ReserveCta } from "@/components/home/reserve-cta";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { GalleryStrip } from "@/components/home/gallery-strip";

export default async function HomePage() {
  const [fusion, reviews] = await Promise.all([
    menuService.list({ cuisine: ["fusion"] }),
    reviewService.list(),
  ]);

  return (
    <>
      {/* The café tour — five pinned scenes. Carries the single <h1>. */}
      <Tour />

      <div id="after-tour" tabIndex={-1} className="outline-none" />

      <TrustMarquee />

      <Reveal>
        <CuisineGrid />
      </Reveal>

      <FusionCarousel items={fusion.items} />

      <Reveal>
        <StorySection />
      </Reveal>

      <Reveal>
        <SeasonalBanner />
      </Reveal>

      <Reveal>
        <Testimonials reviews={reviews} />
      </Reveal>

      <Reveal>
        <ReserveCta />
      </Reveal>

      <Reveal>
        <NewsletterSection />
      </Reveal>

      <Reveal>
        <GalleryStrip />
      </Reveal>
    </>
  );
}
