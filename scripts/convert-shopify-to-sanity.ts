/**
 * Shopify CSV to Sanity NDJSON Converter
 *
 * Usage: npx tsx scripts/convert-shopify-to-sanity.ts
 *
 * Input:  data-sample/products_export.csv
 * Output: data-sample/products-import.ndjson
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse/sync";

// ============================================
// Types
// ============================================

interface ShopifyRow {
  Handle: string;
  Title: string;
  "Body (HTML)": string;
  Vendor: string;
  "Product Category": string;
  Type: string;
  Tags: string;
  Published: string;
  "Variant SKU": string;
  "Variant Price": string;
  "Variant Inventory Qty": string;
  "Image Src": string;
  "Image Position": string;
  Status: string;
  // Custom metafields (Polish)
  "Akcesoria: (product.metafields.custom.akcesoria_)": string;
  "Dyrektor kreatywny: (product.metafields.custom.dyrektor_kreatywny)": string;
  "Kolor: (product.metafields.custom.kolor_)": string;
  "Krótki opis (product.metafields.custom.krotki_opis)": string;
  "Materiał:  (product.metafields.custom.material)": string;
  "Numer seryjny: (product.metafields.custom.numer_seryjny)": string;
  "Rok produkcji: (product.metafields.custom.rok_produkcji_)": string;
  "Stan: (product.metafields.custom.stan_)": string;
  "Wymiary: (product.metafields.custom.wymiary)": string;
}

interface GroupedProduct {
  handle: string;
  title: string;
  bodyHtml: string;
  vendor: string;
  type: string;
  tags: string;
  price: number;
  stock: number;
  images: string[];
  color: string;
  material: string;
  dimensions: string;
  condition: string;
  productionYear: string;
  serialNumber: string;
  accessories: string;
  shortDescription: string;
  status: string;
}

interface SanityCategory {
  _id: string;
  _type: "category";
  title: string;
  slug: { _type: "slug"; current: string };
}

interface SanityProduct {
  _id: string;
  _type: "product";
  name: string;
  slug: { _type: "slug"; current: string };
  description: string;
  price: number;
  category: { _type: "reference"; _ref: string };
  brand?: string;
  material?: string;
  color?: string;
  dimensions?: string;
  condition?: string;
  conditionDetails?: string;
  productionYear?: string;
  serialNumber?: string;
  accessories?: string;
  stock: number;
  featured: boolean;
  images: Array<{ _type: "image"; _sanityAsset: string; _key: string }>;
}

// ============================================
// Mappings
// ============================================

// Polish category types to English slugs and titles
const CATEGORY_MAP: Record<string, { slug: string; title: string }> = {
  Okulary: { slug: "sunglasses", title: "Sunglasses" },
  Pierścionek: { slug: "rings", title: "Rings" },
  Torebka: { slug: "bags", title: "Bags" },
  Torba: { slug: "bags", title: "Bags" },
  Portfel: { slug: "wallets", title: "Wallets" },
  Zegarek: { slug: "watches", title: "Watches" },
  Biżuteria: { slug: "jewelry", title: "Jewelry" },
  Bransoletka: { slug: "bracelets", title: "Bracelets" },
  Naszyjnik: { slug: "necklaces", title: "Necklaces" },
  Kolczyki: { slug: "earrings", title: "Earrings" },
  Pasek: { slug: "belts", title: "Belts" },
  Szalik: { slug: "scarves", title: "Scarves" },
  Chusta: { slug: "scarves", title: "Scarves" },
  Akcesoria: { slug: "accessories", title: "Accessories" },
  "Akcesoria do włosów": { slug: "hair-accessories", title: "Hair Accessories" },
  Sukienka: { slug: "dresses", title: "Dresses" },
  Sandały: { slug: "sandals", title: "Sandals" },
  Espadryle: { slug: "espadrilles", title: "Espadrilles" },
  Szpilki: { slug: "heels", title: "Heels" },
  Top: { slug: "tops", title: "Tops" },
};

// Polish materials to English (matching your schema where possible)
const MATERIAL_MAP: Record<string, string> = {
  // Direct schema matches
  skóra: "leather",
  "skóra naturalna": "leather",
  "skóra cielęca": "leather",
  metal: "metal",
  stal: "metal",
  "stal nierdzewna": "metal",
  drewno: "wood",
  szkło: "glass",
  tkanina: "fabric",
  // Luxury materials
  "różowe złoto": "rose-gold",
  "białe złoto": "white-gold",
  "żółte złoto": "yellow-gold",
  złoto: "gold",
  srebro: "silver",
  platyna: "platinum",
  optyl: "optyl",
  acetat: "acetate",
  tytan: "titanium",
  jedwab: "silk",
  kaszmit: "cashmere",
  wełna: "wool",
  bawełna: "cotton",
  płótno: "canvas",
  "płótno powlekane": "coated-canvas",
  nylon: "nylon",
  brylant: "diamond",
};

// Polish colors to English (matching your schema where possible)
const COLOR_MAP: Record<string, string> = {
  // Direct schema matches
  czarny: "black",
  czarna: "black",
  biały: "white",
  biała: "white",
  szary: "grey",
  szara: "grey",
  // Extended colors for luxury goods
  brązowy: "brown",
  brązowa: "brown",
  brąz: "brown",
  beżowy: "beige",
  beżowa: "beige",
  złoty: "gold",
  złota: "gold",
  złote: "gold",
  srebrny: "silver",
  srebrna: "silver",
  różowy: "pink",
  różowa: "pink",
  "różowe złoto": "rose-gold",
  czerwony: "red",
  czerwona: "red",
  niebieski: "blue",
  niebieska: "blue",
  granatowy: "navy",
  granatowa: "navy",
  zielony: "green",
  zielona: "green",
  bordowy: "burgundy",
  bordowa: "burgundy",
  burgundowy: "burgundy",
  fioletowy: "purple",
  fioletowa: "purple",
  śliwkowy: "plum",
  nude: "nude",
  kremowy: "cream",
  kremowa: "cream",
  karmelowy: "caramel",
  karmelowa: "caramel",
  cognac: "cognac",
  tan: "tan",
  żółty: "yellow",
  pomarańczowy: "orange",
  wielokolorowy: "multicolor",
  przezroczysty: "transparent",
  latte: "latte",
};

// Polish conditions to English enum values
const CONDITION_MAP: Record<string, string> = {
  nowy: "new",
  "nowy (nieużywany)": "new",
  "nieużywany": "like-new",
  "nieużywany (nowy)": "like-new",
  "nieużywany (jak nowy)": "like-new",
  idealny: "excellent",
  "bardzo dobry": "very-good",
  dobry: "good",
};

// ============================================
// HTML Stripper
// ============================================

function stripHTML(html: string): string {
  if (!html) return "";

  return html
    // Remove script/style tags and their content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // Remove HTML tags
    .replace(/<[^>]+>/g, " ")
    // Decode common HTML entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    // Clean up whitespace
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================
// Mappers
// ============================================

function mapMaterial(polishMaterial: string): string | undefined {
  if (!polishMaterial) return undefined;

  const normalized = polishMaterial.toLowerCase().trim();

  // Try direct match
  if (MATERIAL_MAP[normalized]) {
    return MATERIAL_MAP[normalized];
  }

  // Try partial match
  for (const [polish, english] of Object.entries(MATERIAL_MAP)) {
    if (normalized.includes(polish)) {
      return english;
    }
  }

  // Return original if no mapping found (for manual review)
  console.warn(`  [WARN] Unknown material: "${polishMaterial}"`);
  return polishMaterial.toLowerCase().replace(/\s+/g, "-");
}

function mapColor(polishColor: string): string | undefined {
  if (!polishColor) return undefined;

  const normalized = polishColor.toLowerCase().trim();

  // Try direct match
  if (COLOR_MAP[normalized]) {
    return COLOR_MAP[normalized];
  }

  // Try partial match
  for (const [polish, english] of Object.entries(COLOR_MAP)) {
    if (normalized.includes(polish)) {
      return english;
    }
  }

  // Return original if no mapping found
  console.warn(`  [WARN] Unknown color: "${polishColor}"`);
  return polishColor.toLowerCase().replace(/\s+/g, "-");
}

function mapCondition(polishCondition: string): { condition: string; details?: string } {
  if (!polishCondition) return { condition: "good" };

  const normalized = polishCondition.toLowerCase().trim();

  // Check for condition with details in parentheses
  const parenMatch = normalized.match(/^([^(]+)\s*\((.+)\)$/);
  if (parenMatch) {
    const baseCondition = parenMatch[1].trim();
    const details = parenMatch[2].trim();

    const mappedCondition = CONDITION_MAP[baseCondition] || "good";
    return { condition: mappedCondition, details };
  }

  // Try direct match
  if (CONDITION_MAP[normalized]) {
    return { condition: CONDITION_MAP[normalized] };
  }

  // Try partial match
  for (const [polish, english] of Object.entries(CONDITION_MAP)) {
    if (normalized.includes(polish)) {
      return { condition: english };
    }
  }

  return { condition: "good" };
}

function mapCategory(polishType: string): { slug: string; title: string } {
  if (!polishType) {
    return { slug: "other", title: "Other" };
  }

  const normalized = polishType.trim();

  if (CATEGORY_MAP[normalized]) {
    return CATEGORY_MAP[normalized];
  }

  // Fallback: create slug from Polish type
  const slug = normalized
    .toLowerCase()
    .replace(/[ąáà]/g, "a")
    .replace(/[ćč]/g, "c")
    .replace(/[ęéè]/g, "e")
    .replace(/[íì]/g, "i")
    .replace(/[łĺ]/g, "l")
    .replace(/[ńñ]/g, "n")
    .replace(/[óòô]/g, "o")
    .replace(/[śš]/g, "s")
    .replace(/[úùü]/g, "u")
    .replace(/[źżž]/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  console.warn(`  [WARN] Unknown category type: "${polishType}" -> "${slug}"`);
  return { slug, title: normalized };
}

function generateKey(): string {
  return Math.random().toString(36).substring(2, 10);
}

// ============================================
// Main Conversion Logic
// ============================================

function parseShopifyCSV(csvPath: string): ShopifyRow[] {
  const content = readFileSync(csvPath, "utf-8");

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as ShopifyRow[];

  return records;
}

function groupProductsByHandle(rows: ShopifyRow[]): GroupedProduct[] {
  const productMap = new Map<string, GroupedProduct>();

  for (const row of rows) {
    const handle = row.Handle?.trim();
    if (!handle) continue;

    if (!productMap.has(handle)) {
      // First row for this product - capture all data
      const price = parseFloat(row["Variant Price"]) || 0;
      const stock = parseInt(row["Variant Inventory Qty"]) || 1;

      productMap.set(handle, {
        handle,
        title: row.Title || "",
        bodyHtml: row["Body (HTML)"] || "",
        vendor: row.Vendor || "",
        type: row.Type || "",
        tags: row.Tags || "",
        price,
        stock: stock > 0 ? stock : 1, // Default to 1 for vintage items
        images: row["Image Src"] ? [row["Image Src"]] : [],
        color: row["Kolor: (product.metafields.custom.kolor_)"] || "",
        material: row["Materiał:  (product.metafields.custom.material)"] || "",
        dimensions: row["Wymiary: (product.metafields.custom.wymiary)"] || "",
        condition: row["Stan: (product.metafields.custom.stan_)"] || "",
        productionYear: row["Rok produkcji: (product.metafields.custom.rok_produkcji_)"] || "",
        serialNumber: row["Numer seryjny: (product.metafields.custom.numer_seryjny)"] || "",
        accessories: row["Akcesoria: (product.metafields.custom.akcesoria_)"] || "",
        shortDescription: row["Krótki opis (product.metafields.custom.krotki_opis)"] || "",
        status: row.Status || "active",
      });
    } else {
      // Additional row - only add image if present
      const product = productMap.get(handle)!;
      const imageSrc = row["Image Src"];
      if (imageSrc && !product.images.includes(imageSrc)) {
        product.images.push(imageSrc);
      }
    }
  }

  return Array.from(productMap.values());
}

function extractCategories(products: GroupedProduct[]): SanityCategory[] {
  const categorySet = new Map<string, SanityCategory>();

  for (const product of products) {
    if (!product.type) continue;

    const { slug, title } = mapCategory(product.type);

    if (!categorySet.has(slug)) {
      categorySet.set(slug, {
        _id: `category-${slug}`,
        _type: "category",
        title,
        slug: { _type: "slug", current: slug },
      });
    }
  }

  return Array.from(categorySet.values());
}

function convertToSanityProduct(product: GroupedProduct): SanityProduct | null {
  // Skip products without valid handle or title
  if (!product.handle || !product.title) {
    console.warn(`  [SKIP] Invalid product: handle="${product.handle}" title="${product.title}"`);
    return null;
  }

  // Skip inactive products
  if (product.status !== "active") {
    console.warn(`  [SKIP] Inactive product: ${product.handle}`);
    return null;
  }

  const { slug: categorySlug } = mapCategory(product.type);

  // Build description from body HTML or short description
  let description = stripHTML(product.bodyHtml);
  if (!description && product.shortDescription) {
    description = product.shortDescription;
  }

  // Clean undefined values
  const cleanString = (s: string | undefined): string | undefined => {
    if (!s || s.trim() === "") return undefined;
    return s.trim();
  };

  const sanityProduct: SanityProduct = {
    _id: `product-${product.handle}`,
    _type: "product",
    name: product.title,
    slug: { _type: "slug", current: product.handle },
    description,
    price: product.price,
    category: { _type: "reference", _ref: `category-${categorySlug}` },
    stock: product.stock,
    featured: false,
    images: product.images.map((url) => ({
      _type: "image" as const,
      _sanityAsset: `image@${url}`,
      _key: generateKey(),
    })),
  };

  // Add optional fields only if they have values
  if (cleanString(product.vendor)) {
    sanityProduct.brand = product.vendor;
  }
  if (cleanString(product.material)) {
    sanityProduct.material = mapMaterial(product.material);
  }
  if (cleanString(product.color)) {
    sanityProduct.color = mapColor(product.color);
  }
  if (cleanString(product.dimensions)) {
    sanityProduct.dimensions = product.dimensions;
  }
  if (cleanString(product.condition)) {
    const { condition, details } = mapCondition(product.condition);
    sanityProduct.condition = condition;
    if (details) {
      sanityProduct.conditionDetails = details;
    }
  }
  if (cleanString(product.productionYear)) {
    sanityProduct.productionYear = product.productionYear;
  }
  if (cleanString(product.serialNumber)) {
    sanityProduct.serialNumber = product.serialNumber;
  }
  if (cleanString(product.accessories)) {
    sanityProduct.accessories = product.accessories;
  }

  return sanityProduct;
}

// ============================================
// Main
// ============================================

function main() {
  const projectRoot = process.cwd();
  const inputPath = join(projectRoot, "data-sample/products_export.csv");
  const outputPath = join(projectRoot, "data-sample/products-import.ndjson");

  console.log("=".repeat(60));
  console.log("Shopify CSV to Sanity NDJSON Converter");
  console.log("=".repeat(60));
  console.log("\nReading CSV from:", inputPath);

  // Parse CSV
  const rows = parseShopifyCSV(inputPath);
  console.log(`Parsed ${rows.length} CSV rows`);

  // Group by handle
  const products = groupProductsByHandle(rows);
  console.log(`Grouped into ${products.length} products`);

  // Filter to only active products
  const activeProducts = products.filter((p) => p.status === "active");
  console.log(`Active products: ${activeProducts.length}`);

  // Extract categories
  const categories = extractCategories(activeProducts);
  console.log(`\nCategories (${categories.length}):`);
  categories.forEach((c) => console.log(`  - ${c.title} (${c.slug.current})`));

  // Convert products
  console.log("\nConverting products...");
  const sanityProducts = activeProducts
    .map(convertToSanityProduct)
    .filter((p): p is SanityProduct => p !== null);

  console.log(`Converted ${sanityProducts.length} products`);

  // Build NDJSON output (categories first, then products)
  const ndjsonLines = [
    ...categories.map((c) => JSON.stringify(c)),
    ...sanityProducts.map((p) => JSON.stringify(p)),
  ];

  // Write output
  writeFileSync(outputPath, ndjsonLines.join("\n") + "\n");

  console.log("\n" + "=".repeat(60));
  console.log(`Output written to: ${outputPath}`);
  console.log(`  - ${categories.length} categories`);
  console.log(`  - ${sanityProducts.length} products`);
  console.log("=".repeat(60));

  // Print sample of first product
  if (sanityProducts.length > 0) {
    console.log("\nSample product (first):");
    console.log(JSON.stringify(sanityProducts[0], null, 2));
  }

  console.log(
    "\nTo import into Sanity, run:\n" +
      "  npx sanity dataset import data-sample/products-import.ndjson production --replace\n"
  );
}

main();
