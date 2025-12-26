# Gibbarosa - Luxury Preowned E-Commerce

A Next.js 16 e-commerce platform for authenticated preowned luxury goods, powered by Sanity CMS.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **CMS**: Sanity v3 with embedded Studio at `/studio`
- **Styling**: Tailwind CSS v4 with custom luxury theme
- **UI Components**: shadcn/ui
- **Animations**: Motion (Framer Motion)
- **Icons**: Tabler Icons, Sanity Icons
- **Image Lightbox**: yet-another-react-lightbox
- **Language**: TypeScript (strict mode)
- **Currency**: Polish Złoty (PLN) - formatted with `toLocaleString("pl-PL")`

## Project Structure

```
├── app/
│   ├── (app)/              # Main storefront routes
│   │   ├── page.tsx        # Homepage
│   │   ├── shop/           # Shop with filters
│   │   └── product/[slug]/ # Product detail page
│   ├── studio/             # Sanity Studio (embedded)
│   ├── globals.css         # Theme & CSS variables
│   └── layout.tsx          # Root layout with fonts
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── product/            # Product-specific components
│   ├── navbar.tsx          # Main navigation
│   ├── footer.tsx          # Site footer
│   ├── hero.tsx            # Homepage hero with rotating products
│   └── product-card.tsx    # Reusable product card
├── lib/
│   ├── constants/          # Shared constants (filters, status)
│   ├── sanity/
│   │   └── queries/        # GROQ queries by domain
│   └── utils.ts            # Utility functions (cn, etc.)
├── sanity/
│   ├── schemaTypes/        # Sanity document schemas
│   └── lib/                # Sanity client & live preview
└── sanity.types.ts         # Auto-generated types (do not edit)
```

---

## Sanity Schemas

### Product (`product`)

Main document for luxury items. Groups: `details`, `provenance`, `media`, `inventory`.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Product name (required) |
| `slug` | slug | URL-friendly identifier (required) |
| `brand` | string | Brand/designer name (required) |
| `description` | text | Detailed description |
| `price` | number | Current selling price in PLN (required) |
| `compareAtPrice` | number | Original price before discount (for sales) |
| `category` | reference | Link to Category document (required) |
| `material` | string | From MATERIALS constant (dropdown) |
| `color` | string | From COLORS constant (dropdown) |
| `dimensions` | string | Size info (e.g., "30 x 20 x 10 cm") |
| `condition` | string | From CONDITIONS constant (radio) |
| `conditionDetails` | text | Specific wear/repair notes |
| `productionYear` | string | Year/era (e.g., "2019", "1980s") |
| `serialNumber` | string | Manufacturer reference |
| `accessories` | string | Included items (dust bag, box, etc.) |
| `images` | array[image] | Product photos with hotspot (min 1) |
| `stock` | number | Available quantity (default: 1) |
| `featured` | boolean | Show in homepage features |
| `releaseDate` | datetime | When added to store (for New Arrivals) |

### Category (`category`)

Product categorization.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Category name (required) |
| `slug` | slug | URL identifier (required) |
| `image` | image | Category thumbnail |

### Hero Settings (`heroSettings`)

Singleton for homepage hero configuration.

| Field | Type | Description |
|-------|------|-------------|
| `featuredProducts` | array[reference] | Up to 3 products to rotate in hero |

### Customer (`customer`)

Customer records linked to Clerk/Stripe.

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | Customer email (required) |
| `name` | string | Full name |
| `clerkUserId` | string | Clerk authentication ID |
| `stripeCustomerId` | string | Stripe customer ID (required) |
| `createdAt` | datetime | Account creation date |

### Order (`order`)

Order records with line items.

| Field | Type | Description |
|-------|------|-------------|
| `orderNumber` | string | Unique order number |
| `items` | array[object] | Line items (product ref, quantity, priceAtPurchase) |
| `total` | number | Order total in PLN |
| `status` | string | paid, shipped, delivered, cancelled |
| `customer` | reference | Link to Customer |
| `email` | string | Customer email |
| `address` | object | Shipping address |
| `stripePaymentId` | string | Stripe payment intent ID |
| `createdAt` | datetime | Order date |

---

## Queries & Types

### Type Generation

Types are auto-generated from schemas and queries:

```bash
npx sanity typegen generate
```

Output: `sanity.types.ts` - **Do not edit manually**

### Query Architecture

Queries are organized in `lib/sanity/queries/`:

- `products.ts` - Product listing, filtering, search
- `categories.ts` - Category queries
- `customers.ts` - Customer lookups
- `orders.ts` - Order management
- `stats.ts` - Analytics/dashboard queries

### Key Query Patterns

**DRY Filter Conditions** - Shared fragment for all filter queries:

```groq
const PRODUCT_FILTER_CONDITIONS = `
  _type == "product"
  && ($categorySlug == "" || category->slug.current == $categorySlug)
  && ($condition == "" || condition == $condition)
  && ($color == "" || color == $color)
  && ($material == "" || material == $material)
  && ($minPrice == 0 || price >= $minPrice)
  && ($maxPrice == 0 || price <= $maxPrice)
  && ($searchQuery == "" || name match $searchQuery + "*" || ...)
  && ($inStock == false || stock > 0)
  && ($onSale == false || (defined(compareAtPrice) && compareAtPrice > price))
`;
```

**Relevance Scoring** - For search results:

```groq
score(
  boost(name match $searchQuery + "*", 3),
  boost(brand match $searchQuery + "*", 3),
  boost(description match $searchQuery + "*", 1)
)
```

**New Arrivals Sorting** - Falls back to `_createdAt`:

```groq
order(coalesce(releaseDate, _createdAt) desc)
```

### Filter Parameters

All filter queries accept these parameters:

```typescript
{
  categorySlug: string;   // "" for all
  condition: string;      // "" for all
  color: string;          // "" for all
  material: string;       // "" for all
  minPrice: number;       // 0 for no min
  maxPrice: number;       // 0 for no max
  searchQuery: string;    // "" for no search
  inStock: boolean;       // false to include out-of-stock
  onSale: boolean;        // true to show only sale items
}
```

### Sort Queries

| Query | Sort Order | Use Case |
|-------|------------|----------|
| `FILTER_PRODUCTS_BY_NAME_QUERY` | name asc | Default (A-Z) |
| `FILTER_PRODUCTS_BY_PRICE_ASC_QUERY` | price asc | Price: Low to High |
| `FILTER_PRODUCTS_BY_PRICE_DESC_QUERY` | price desc | Price: High to Low |
| `FILTER_PRODUCTS_BY_RELEVANCE_QUERY` | _score desc | Search results |
| `FILTER_PRODUCTS_BY_NEWEST_QUERY` | releaseDate desc | New Arrivals |

---

## Shared Constants

Located in `lib/constants/filters.ts`. Used by both frontend filters and Sanity schemas.

### Colors

Neutrals, browns, metallics, colors, special (multicolor, transparent).

### Materials

Leathers, metals/precious, textiles, other (glass, acetate, etc.).

### Conditions

```typescript
["new", "like-new", "excellent", "very-good", "good"]
```

### Sort Options

```typescript
["newest", "name", "price_asc", "price_desc", "relevance"]
```

### Sanity Format Exports

Constants are exported in Sanity's `options.list` format:

```typescript
COLORS_SANITY_LIST     // { title, value }[]
MATERIALS_SANITY_LIST
CONDITIONS_SANITY_LIST
```

---

## Design System

### Color Palette

Luxury aesthetic with warm cream background and elegant blacks:

| Variable | Light | Dark | Usage |
|----------|-------|------|-------|
| `--background` | Warm cream | Deep charcoal | Page background |
| `--foreground` | Near black | Off white | Primary text |
| `--accent` | Warm gold | Bright gold | Hover states, links |
| `--muted-foreground` | Medium gray | Light gray | Secondary text |
| `--border` | Light cream | Dark gray | Borders, dividers |
| `--secondary` | Light cream | Dark charcoal | Card backgrounds |

### Typography

- **Display/Body**: Cormorant Garamond (serif) - elegant, editorial feel
- **UI Text**: Inter (sans-serif) - clean, readable for labels/buttons
- **Monospace**: Geist Mono

### Typography Patterns

```tsx
// Headings - Cormorant Garamond (default font)
<h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight">

// Labels/UI text - Inter
<span className="text-xs font-[Inter,sans-serif] tracking-[0.15em] uppercase">

// Body text - Inter for readability
<p className="text-sm font-[Inter,sans-serif] text-muted-foreground">
```

### Component Patterns

**Product Card**:
- Aspect ratio: 4:5
- Image hover: crossfade to second image
- Badges: condition (bottom-left), sale (red)
- Sale price: red text with crossed-out original

**Buttons**:
- Primary: dark background, light text
- Full-width for CTAs: `className="w-full h-14"`

**Links**:
- Uppercase tracking: `tracking-[0.1em]` or `tracking-[0.15em]`
- Hover: `text-foreground` from `text-muted-foreground`

**Badges**:
```tsx
// Condition badge
<span className="text-[10px] font-[Inter,sans-serif] tracking-[0.1em] uppercase bg-background/90 backdrop-blur-sm px-2.5 py-1">

// Sale badge
<span className="text-[10px] font-[Inter,sans-serif] tracking-[0.1em] uppercase bg-red-600 px-2.5 py-1 text-white">
```

---

## URL Structure

### Shop Routes

| URL | Description |
|-----|-------------|
| `/shop` | All products |
| `/shop?sort=newest` | New Arrivals |
| `/shop?sale=true` | Promotions (on sale) |
| `/shop?category=bags` | Filter by category |
| `/shop?condition=excellent` | Filter by condition |
| `/shop?q=chanel` | Search query |

### Product Routes

| URL | Description |
|-----|-------------|
| `/product/[slug]` | Product detail page |

### Navigation Links

Navbar and footer link to:
- Shop All: `/shop`
- New Arrivals: `/shop?sort=newest`
- Promotions: `/shop?sale=true`

---

## Important Implementation Notes

### Sale/Promotion Logic

A product is "on sale" when:
```typescript
compareAtPrice && price && compareAtPrice > price
```

Display:
- Sale badge (red)
- Current price in red
- Original price crossed out

### New Arrivals Logic

Sorted by `releaseDate` descending, falling back to `_createdAt` if not set.

### Image Handling

- Product cards show up to 4 images (hover preview)
- Primary/secondary image crossfade on hover
- Lightbox with zoom, thumbnails, fullscreen

### Type Casting

Sanity typegen infers `null` for fields with no data. Cast when needed:

```typescript
const compareAtPrice = product.compareAtPrice as number | null;
```

### Server vs Client Components

- Shop page: Server component (data fetching)
- Shop filters: Client component (URL state)
- Product card: Client component (hover state)
- Product gallery: Client component (lightbox)

---

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type generation (run after schema changes)
npx sanity typegen generate

# Sanity Studio (embedded)
# Visit /studio in browser
```
