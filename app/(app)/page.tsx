import { Categories } from "@/components/categories";
import { FAQs } from "@/components/faqs";
import { FeaturedProducts } from "@/components/featured-products";
import { Hero } from "@/components/hero";
import { LogoCloud } from "@/components/logo-cloud";
import { Newsletter } from "@/components/newsletter";
import { StorySection } from "@/components/story-section";
import { CATEGORIES_WITH_COUNT_QUERY } from "@/lib/sanity/queries/categories";
import {
  FEATURED_PRODUCTS_QUERY,
  HERO_PRODUCTS_QUERY,
} from "@/lib/sanity/queries/products";
import { sanityFetch } from "@/sanity/lib/live";

export default async function Home() {
  // Fetch categories with product count for category grid
  const { data: categories } = await sanityFetch({
    query: CATEGORIES_WITH_COUNT_QUERY,
  });

  // Fetch featured products for carousel
  const { data: featuredProducts } = await sanityFetch({
    query: FEATURED_PRODUCTS_QUERY,
  });

  // Fetch hero products for "Just Arrived" rotating card
  const { data: heroSettings } = await sanityFetch({
    query: HERO_PRODUCTS_QUERY,
  });

  // Extract products from heroSettings (type assertion needed as TypeGen
  // infers null when no document exists yet)
  const heroProducts = (heroSettings as {
    products?: Array<{
      _id: string;
      name: string | null;
      slug: string | null;
      price: number | null;
      brand: string | null;
      image: { asset: { _id: string; url: string | null } | null } | null;
    }>;
  } | null)?.products ?? [];

  return (
    <div className="min-h-screen">
      <Hero heroProducts={heroProducts} />
      <Categories categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <StorySection />
      <Newsletter />
      <LogoCloud />
      <FAQs />
    </div>
  );
}
