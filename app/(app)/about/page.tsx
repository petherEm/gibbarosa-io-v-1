import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | Gibbarosa",
  description:
    "Gibbarosa isn't just a brand. It's a testament to legacy, individuality, and the enduring beauty of well-made things.",
};

export default function AboutPage() {
  return (
    <main className="pt-24 pb-20 md:pb-32">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] mb-20 md:mb-32">
        <Image
          src="/about/about-about-02.jpg"
          alt="Gibbarosa - Luxury Heritage"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <Container className="relative h-full flex flex-col justify-end pb-12 md:pb-20">
          <p className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-white/80 mb-4">
            Our Story
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white max-w-4xl leading-tight text-balance">
            Gibbarosa isn't just a brand. It's a testament to legacy,
            individuality, and the enduring beauty of well-made things.
          </h1>
        </Container>
      </section>

      {/* Founding Story */}
      <section className="mb-20 md:mb-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <Heading className="text-2xl md:text-3xl lg:text-4xl mb-8 text-balance">
                Founded in the mountains, rooted in heritage
              </Heading>
              <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed text-balance">
                <p>
                  Gibbarosa was founded in 2023 during a ski trip to Chamonix,
                  the realization of a vision long nurtured by its founder,
                  Klaudia.
                </p>
                <p>
                  Born and raised in France, Klaudia's roots trace back to
                  Poland, France, and Sicily—a rich heritage woven into the
                  fabric of the brand.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image
                  src="/about/about-about-01.webp"
                  alt="Gibbarosa founding story"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Rina Tribute */}
      <section className="mb-20 md:mb-32 bg-secondary py-20 md:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="aspect-[3/4] relative overflow-hidden max-w-md mx-auto lg:mx-0">
                <Image
                  src="/about/about-about-rina.webp"
                  alt="Rina Gibbarosa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 40vw"
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-accent mb-6">
                The Name
              </p>
              <Heading className="text-2xl md:text-3xl lg:text-4xl mb-8 text-balance">
                A tribute to Rina Gibbarosa
              </Heading>
              <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed text-balance">
                <p>
                  The name Gibbarosa pays homage to Klaudia's Sicilian
                  grandmother, Rina Gibbarosa, a woman whose impeccable style
                  and devotion to craftsmanship have become the brand's
                  cornerstone.
                </p>
                <p>
                  Rina was a master of made-to-measure elegance, effortlessly
                  blending the finest materials, textures, and colors—a legacy
                  of artistry that informs everything Gibbarosa stands for.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mother's Philosophy */}
      <section className="mb-20 md:mb-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-accent mb-6">
                The Philosophy
              </p>
              <Heading className="text-2xl md:text-3xl lg:text-4xl mb-8 text-balance">
                "Do whatever the hell you want in life"
              </Heading>
              <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed text-balance">
                <p>
                  But Gibbarosa is also a tribute. To Klaudia's mother, whose
                  guiding philosophy—"Do whatever the hell you want in
                  life"—underscores the brand's fearless approach.
                </p>
                <p>
                  It's a sentiment inherited from Rina, an ethos of independence
                  and confidence that runs through every piece we curate.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src="/about/about-about-03.webp"
                  alt="Gibbarosa philosophy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="bg-foreground text-background py-20 md:py-32">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-background/60 mb-6">
              Our Mission
            </p>
            <Heading className="text-2xl md:text-3xl lg:text-4xl mb-8 text-background text-balance">
              Giving a second life to luxury goods of exceptional quality
            </Heading>
            <p className="text-base md:text-lg text-background/70 leading-relaxed text-balance">
              Each piece is meticulously curated, celebrating craftsmanship and
              detail, with treasures sourced from France, Italy, and Japan.
            </p>
          </div>
        </Container>
      </section>
    </main>
  );
}
