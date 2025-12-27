import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/sanity/queries/products";
import { sanityFetch } from "@/sanity/lib/live";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductDetails } from "./product-details";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.brand} ${product.name} | Gibbarosa`,
    description: product.description ?? `${product.brand} ${product.name}`,
    openGraph: {
      title: `${product.brand} ${product.name}`,
      description: product.description ?? undefined,
      images: product.images?.[0]?.asset?.url
        ? [{ url: product.images[0].asset.url }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) {
    notFound();
  }

  // Cast compareAtPrice since typegen infers null when no data exists
  const compareAtPrice = product.compareAtPrice as number | null;
  const isOnSale =
    compareAtPrice && product.price && compareAtPrice > product.price;

  return (
    <main className="pt-24 pb-20 md:pb-32">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm font-[Inter,sans-serif]">
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-muted-foreground">/</li>
            <li>
              <Link
                href="/shop"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Shop
              </Link>
            </li>
            {product.category && (
              <>
                <li className="text-muted-foreground">/</li>
                <li>
                  <Link
                    href={`/shop?category=${product.category.slug}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {product.category.title}
                  </Link>
                </li>
              </>
            )}
            <li className="text-muted-foreground">/</li>
            <li className="text-foreground truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Column - Images */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductImageGallery
              images={product.images ?? []}
              productName={product.name ?? "Product"}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col">
            {/* Brand & Sale Badge */}
            <div className="flex items-center gap-3 mb-3">
              <p className="text-xs font-[Inter,sans-serif] tracking-[0.2em] uppercase text-muted-foreground">
                {product.brand}
              </p>
              {isOnSale && (
                <span className="text-[10px] font-[Inter,sans-serif] tracking-[0.1em] uppercase bg-red-600 px-2 py-0.5 text-white">
                  Sale
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-foreground mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <p
                className={`text-2xl font-light ${
                  isOnSale ? "text-red-600" : "text-foreground"
                }`}
              >
                {product.price?.toLocaleString("pl-PL")} zł
              </p>
              {isOnSale && compareAtPrice && (
                <p className="text-lg font-light text-muted-foreground line-through">
                  {compareAtPrice.toLocaleString("pl-PL")} zł
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-base text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Add to Cart Button */}
            <AddToCartButton
              product={{
                _id: product._id,
                name: product.name,
                price: product.price,
                slug: product.slug,
                image: product.images?.[0]?.asset?.url,
              }}
              stock={product.stock ?? 0}
              className="w-full h-14 text-base mb-10"
            />

            {/* Product Details */}
            <ProductDetails product={product} />
          </div>
        </div>
      </Container>
    </main>
  );
}
