import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { POLICIES, POLICY_SLUGS } from "@/mocks/content";
import { Container } from "@/components/common/container";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return POLICY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const doc = POLICIES[slug];
  return { title: doc ? doc.title : "Policy", description: doc?.intro };
}

export default async function PolicyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = POLICIES[slug];
  if (!doc) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">Last updated {doc.updated}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">{doc.title}</h1>
        <p className="mt-4 text-muted-foreground">{doc.intro}</p>

        <div className="mt-10 space-y-8">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-xl font-semibold text-foreground">{s.heading}</h2>
              <p className="mt-2 text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    </Container>
  );
}
