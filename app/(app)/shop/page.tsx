import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import {
  FILTER_PRODUCTS_BY_NAME_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
  FILTER_PRODUCTS_BY_NEWEST_QUERY,
} from "@/lib/sanity/queries/products";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { sanityFetch } from "@/sanity/lib/live";
import type { Metadata } from "next";
import { ShopFilters } from "./shop-filters";
import { ShopProducts } from "./shop-products";
import type { SortValue } from "@/lib/constants/filters";

export const metadata: Metadata = {
  title: "Shop | Gibbarosa",
  description:
    "Discover our curated collection of authenticated preowned luxury bags, accessories, and fashion pieces.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    condition?: string;
    color?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    q?: string;
    sale?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  // Parse filter parameters
  const filters = {
    categorySlug: params.category ?? "",
    condition: params.condition ?? "",
    color: params.color ?? "",
    material: params.material ?? "",
    minPrice: params.minPrice ? parseInt(params.minPrice, 10) : 0,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : 0,
    searchQuery: params.q ?? "",
    inStock: false, // Show all products including out of stock
    onSale: params.sale === "true",
  };

  const sort = (params.sort as SortValue) ?? "name";

  // Select query based on sort option
  const getQuery = () => {
    switch (sort) {
      case "newest":
        return FILTER_PRODUCTS_BY_NEWEST_QUERY;
      case "price_asc":
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case "price_desc":
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      case "relevance":
        return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  // Fetch products and categories in parallel
  const [{ data: products }, { data: categories }] = await Promise.all([
    sanityFetch({
      query: getQuery(),
      params: filters,
    }),
    sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    }),
  ]);

  // Build page title based on filters
  const getPageTitle = () => {
    if (params.q) return `Search: "${params.q}"`;
    if (params.sale === "true") return "Promotions";
    if (params.category) {
      const category = categories.find((c) => c.slug === params.category);
      return category?.title ?? "Shop";
    }
    if (params.sort === "newest") return "New Arrivals";
    return "Shop All";
  };

  return (
    <main className="pt-24 pb-20 md:pb-32">
      <Container>
        {/* Header */}
        <div className="mb-10">
          <Heading as="h1" className="text-3xl md:text-4xl lg:text-5xl mb-4">
            {getPageTitle()}
          </Heading>
          <p className="text-sm text-muted-foreground font-[Inter,sans-serif]">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Filters and Products */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <ShopFilters categories={categories} />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <ShopProducts products={products} />
          </div>
        </div>
      </Container>
    </main>
  );
}
