# Gibbarosa - Luxury Preowned E-Commerce

A Next.js 16 e-commerce platform for authenticated preowned luxury goods, powered by Sanity CMS.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **CMS**: Sanity v3 with embedded Studio at `/studio`
- **Auth**: Clerk (authentication & user management)
- **Payments**: Stripe Checkout (hosted payment page)
- **AI**: Vercel AI SDK 6 (beta) with Claude via AI Gateway
- **State**: Zustand (cart + chat stores with SSR-safe hydration)
- **Styling**: Tailwind CSS v4 with custom luxury theme
- **UI Components**: shadcn/ui
- **Animations**: Motion (Framer Motion)
- **Icons**: Tabler Icons, Sanity Icons, Lucide
- **Image Lightbox**: yet-another-react-lightbox
- **Language**: TypeScript (strict mode)
- **Currency**: Polish Złoty (PLN) - formatted with `toLocaleString("pl-PL")`

## Project Structure

```
├── app/
│   ├── (app)/                    # Main storefront routes
│   │   ├── page.tsx              # Homepage
│   │   ├── about/                # About page
│   │   ├── shop/                 # Shop with filters
│   │   ├── product/[slug]/       # Product detail page
│   │   ├── checkout/             # Checkout page
│   │   │   └── success/          # Order confirmation
│   │   └── account/
│   │       └── orders/           # Customer orders
│   │           └── [orderNumber]/ # Order detail
│   ├── api/
│   │   ├── chat/                 # AI chat endpoint
│   │   └── webhooks/stripe/      # Stripe webhook handler
│   ├── studio/                   # Sanity Studio (embedded)
│   ├── globals.css               # Theme & CSS variables
│   └── layout.tsx                # Root layout with fonts
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── cart/                     # Cart components
│   │   ├── add-to-cart-button.tsx
│   │   ├── cart-button.tsx
│   │   ├── cart-drawer.tsx
│   │   └── cart-item.tsx
│   ├── chat/                     # AI chat components
│   │   ├── welcome-screen.tsx
│   │   ├── message-bubble.tsx
│   │   ├── message-content.tsx
│   │   ├── tool-call-ui.tsx
│   │   ├── product-card-widget.tsx
│   │   └── order-card-widget.tsx
│   ├── checkout/                 # Checkout components
│   │   ├── checkout-content.tsx
│   │   ├── checkout-form.tsx
│   │   ├── checkout-item.tsx
│   │   └── checkout-summary.tsx
│   ├── orders/                   # Order display components
│   │   ├── order-card.tsx
│   │   └── order-status-badge.tsx
│   ├── product/                  # Product-specific components
│   ├── navbar.tsx                # Main navigation (Clerk + chat button)
│   ├── chat-sheet.tsx            # AI chat sidebar
│   ├── footer.tsx                # Site footer
│   ├── hero.tsx                  # Homepage hero with rotating products
│   └── product-card.tsx          # Reusable product card
├── hooks/
│   └── useCartStock.ts           # Real-time stock validation
├── lib/
│   ├── actions/                  # Server actions
│   │   ├── checkout.ts           # Stripe checkout session
│   │   └── customer.ts           # Customer management
│   ├── ai/                       # AI assistant
│   │   ├── shopping-agent.ts     # Agent factory with tools
│   │   ├── types.ts              # Shared AI types
│   │   └── tools/                # AI tools
│   │       ├── search-products.ts
│   │       └── get-my-orders.ts
│   ├── constants/                # Shared constants
│   │   ├── filters.ts            # Colors, materials, conditions
│   │   ├── orderStatus.ts        # Order status config
│   │   └── stock.ts              # Stock thresholds
│   ├── sanity/
│   │   └── queries/              # GROQ queries by domain
│   ├── store/                    # Zustand stores
│   │   ├── cart-store.ts         # Cart state & actions
│   │   ├── cart-store-provider.tsx
│   │   ├── chat-store.ts         # Chat UI state
│   │   └── chat-store-provider.tsx
│   └── utils.ts                  # Utility functions (cn, formatPrice, etc.)
├── sanity/
│   ├── schemaTypes/              # Sanity document schemas
│   └── lib/                      # Sanity client & live preview
└── sanity.types.ts               # Auto-generated types (do not edit)
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

### Checkout Routes

| URL | Description |
|-----|-------------|
| `/checkout` | Cart review & checkout initiation |
| `/checkout/success?session_id=...` | Order confirmation (clears cart) |

### Account Routes

| URL | Description |
|-----|-------------|
| `/account/orders` | Customer order history |
| `/account/orders/[orderNumber]` | Order detail page |
| `/sign-in` | Clerk sign-in (redirects back) |
| `/sign-up` | Clerk sign-up |

### Navigation Links

Navbar and footer link to:
- Shop All: `/shop`
- New Arrivals: `/shop?sort=newest`
- Promotions: `/shop?sale=true`
- My Orders: `/account/orders` (signed in only)

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

### Sold Items Display

When stock = 0, items show "Gone Forever":
- Product cards: overlay with "Gone Forever" badge
- Product page: disabled button with "Gone Forever"
- Checkout: warning if item became unavailable

---

## Cart System

### Architecture

Zustand store with localStorage persistence and SSR-safe hydration:

```typescript
// lib/store/cart-store.ts
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Actions: addItem, removeItem, updateQuantity, clearCart, toggleCart
```

### SSR Hydration

Uses `skipHydration: true` with manual rehydration to prevent hydration mismatch:

```typescript
// cart-store-provider.tsx
useEffect(() => {
  storeRef.current?.persist.rehydrate();
}, []);
```

### Hooks

```typescript
useCartItems()      // Get all items
useCartActions()    // Get actions (addItem, removeItem, etc.)
useCartItem(id)     // Find specific item
useTotalPrice()     // Calculate total
useTotalItems()     // Count items
```

### Stock Validation

`useCartStock` hook fetches real-time stock from Sanity:

```typescript
const { stockMap, isLoading, hasStockIssues } = useCartStock(items);
// stockMap: Map<productId, StockInfo>
// hasStockIssues: true if any item out of stock
```

---

## Checkout Flow

### Flow Diagram

```
Cart → Checkout Page → Stripe Checkout → Success Page
                ↓              ↓
         Stock Check    Webhook (order creation)
```

### Server Actions

**`createCheckoutSession(items)`** - `lib/actions/checkout.ts`
1. Verify user authenticated (Clerk)
2. Validate cart not empty
3. Fetch current prices/stock from Sanity
4. Create/find Stripe customer
5. Create Stripe Checkout Session
6. Return session URL for redirect

**`getOrCreateStripeCustomer(email, name, clerkUserId)`** - `lib/actions/customer.ts`
1. Check Sanity for existing customer
2. Check Stripe for existing customer
3. Create in both if needed
4. Return `{ stripeCustomerId, sanityCustomerId }`

### Stripe Webhook

**`POST /api/webhooks/stripe`** handles `checkout.session.completed`:

1. Verify signature
2. Idempotency check (prevent duplicate orders)
3. Extract metadata from session
4. Create order in Sanity
5. Decrement stock (transaction)

### Metadata Passed to Stripe

```typescript
{
  clerkUserId: string;
  userEmail: string;
  sanityCustomerId: string;
  productIds: string;      // comma-separated
  quantities: string;      // comma-separated
}
```

---

## Order System

### Order Statuses

Defined in `lib/constants/orderStatus.ts`:

| Status | Label | Color | Icon |
|--------|-------|-------|------|
| `paid` | Paid | Green | CreditCard |
| `shipped` | Shipped | Blue | Truck |
| `delivered` | Delivered | Gray | Package |
| `cancelled` | Cancelled | Red | XCircle |

### Queries

```typescript
ORDERS_BY_USER_QUERY          // List for user (by clerkUserId)
ORDER_BY_NUMBER_FOR_USER_QUERY // Detail with ownership check
ORDER_BY_STRIPE_PAYMENT_ID_QUERY // Idempotency check
```

### Security

Order detail query includes ownership check:
```groq
*[_type == "order"
  && orderNumber == $orderNumber
  && clerkUserId == $clerkUserId][0]
```

---

## Authentication

### Clerk Integration

- `ClerkProvider` wraps `(app)` layout
- `SignedIn`/`SignedOut` for conditional UI
- `UserButton` for user menu
- `auth()` for server-side user ID

### Protected Routes

Account routes redirect to sign-in:
```typescript
const { userId } = await auth();
if (!userId) {
  redirect("/sign-in?redirect_url=/account/orders");
}
```

### Navbar Auth State

```tsx
<SignedIn>
  <Link href="/account/orders">My Orders</Link>
  <UserButton />
</SignedIn>
<SignedOut>
  <Link href="/sign-in">Sign In</Link>
</SignedOut>
```

---

## AI Shopping Assistant

### Overview

AI-powered chat assistant using Vercel AI SDK 6 (beta) with Claude via AI Gateway. The assistant helps users:
- Discover products by brand, category, material, color, or price
- Check order status (authenticated users only)
- Navigate to product pages

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ ChatSheet    │ ←→ │ useChat hook │ ←→ │ /api/chat    │  │
│  │ (sidebar UI) │    │ (@ai-sdk/   │    │ (route)      │  │
│  └──────────────┘    │  react)      │    └──────────────┘  │
│                      └──────────────┘            ↓          │
└─────────────────────────────────────────────────────────────┘
                                                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend                                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ToolLoopAgent                                         │  │
│  │  - model: gateway("anthropic/claude-sonnet-4-5")     │  │
│  │  - instructions: luxury preowned assistant prompt     │  │
│  │  - tools: searchProducts, getMyOrders (if auth)      │  │
│  └──────────────────────────────────────────────────────┘  │
│                      ↓                    ↓                 │
│  ┌──────────────────────┐    ┌──────────────────────┐     │
│  │ searchProducts       │    │ getMyOrders          │     │
│  │ (Sanity query)       │    │ (Sanity query)       │     │
│  └──────────────────────┘    └──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
├── app/api/chat/route.ts           # API endpoint
├── components/
│   ├── chat-sheet.tsx              # Main chat sidebar
│   └── chat/
│       ├── index.ts                # Barrel exports
│       ├── types.ts                # ToolCallPart type
│       ├── utils.ts                # Message parsing utilities
│       ├── welcome-screen.tsx      # Initial suggestions
│       ├── message-bubble.tsx      # User/assistant messages
│       ├── message-content.tsx     # Markdown rendering
│       ├── tool-call-ui.tsx        # Tool status/results
│       ├── product-card-widget.tsx # Product result card
│       └── order-card-widget.tsx   # Order result card
├── lib/
│   ├── ai/
│   │   ├── shopping-agent.ts       # Agent factory
│   │   ├── types.ts                # Shared AI types
│   │   └── tools/
│   │       ├── search-products.ts  # Product search tool
│   │       └── get-my-orders.ts    # Orders tool (auth-gated)
│   └── store/
│       ├── chat-store.ts           # Chat UI state
│       └── chat-store-provider.tsx # SSR-safe provider
```

### Tools

#### searchProducts

Searches products in Sanity with filters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | string | Text search (name, brand, description) |
| `category` | string | Category slug (bags, watches, sunglasses, etc.) |
| `material` | enum | leather, gold, silver, silk, etc. |
| `color` | enum | black, brown, beige, gold, etc. |
| `minPrice` | number | Minimum price in PLN |
| `maxPrice` | number | Maximum price in PLN |

Returns: Product list with name, price, category, stock status, productUrl

#### getMyOrders (authenticated only)

Fetches user's orders with optional status filter:

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | enum | paid, shipped, delivered, cancelled |

Returns: Order list with orderNumber, total, status, itemNames, orderUrl

### Chat Store

Simple Zustand store for UI state (no persistence needed):

```typescript
interface ChatState {
  isOpen: boolean;
  pendingMessage: string | null;  // For pre-filled messages
}

// Hooks
useIsChatOpen()           // Get open state
usePendingMessage()       // Get pending message
useChatActions()          // { openChat, openChatWithMessage, closeChat, toggleChat }
```

### Integration Points

**Layout** (`app/(app)/layout.tsx`):
```tsx
<ChatStoreProvider>
  <Navbar />
  <main>{children}</main>
  <ChatSheet />
</ChatStoreProvider>
```

**Navbar** - Sparkles icon button triggers `openChat()`

**Product pages** (optional) - Can use `openChatWithMessage("Tell me about similar products to X")`

### Styling

Chat components use project design tokens:
- `bg-background`, `bg-secondary`, `bg-card` for surfaces
- `text-foreground`, `text-muted-foreground` for text
- `text-accent` for highlights and links
- `border-border` for borders
- `font-[Inter,sans-serif] tracking-[0.1em] uppercase` for labels

---

## Environment Variables

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_WRITE_TOKEN=        # For webhooks/mutations

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_BASE_URL=          # For success/cancel URLs

# AI Gateway (Vercel AI SDK)
AI_GATEWAY_API_KEY=            # For Claude via AI Gateway
```

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

# Stripe webhook local testing
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Key Business Logic

### Single Item Inventory

This is a preowned luxury shop - each item is unique:
- Stock is typically 1 per product
- No quantity selectors in cart
- When sold, item shows "Gone Forever"

### Price Validation

Prices are validated server-side before checkout:
- Fetches current price from Sanity
- Prevents cart manipulation attacks
- Uses Sanity price, not client price

### Order Number Format

```
ORD-{timestamp_base36}-{random_4chars}
Example: ORD-M5KX2A-7B3F
```
