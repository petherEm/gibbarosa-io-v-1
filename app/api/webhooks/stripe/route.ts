import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { client, writeClient } from "@/sanity/lib/client";
import { ORDER_BY_STRIPE_PAYMENT_ID_QUERY } from "@/lib/sanity/queries/orders";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(sessionFromEvent: Stripe.Checkout.Session) {
  const stripePaymentId = sessionFromEvent.payment_intent as string;
  console.log(`Processing checkout.session.completed for payment: ${stripePaymentId}`);

  try {
    // Idempotency check: prevent duplicate processing on webhook retries
    const existingOrder = await client.fetch(ORDER_BY_STRIPE_PAYMENT_ID_QUERY, {
      stripePaymentId,
    });

    if (existingOrder) {
      console.log(
        `Webhook already processed for payment ${stripePaymentId}, skipping`
      );
      return;
    }

    // Retrieve full session (shipping_details included by default when shipping_address_collection is used)
    const session = await stripe.checkout.sessions.retrieve(sessionFromEvent.id);
    console.log("Session metadata:", session.metadata);

    // Extract metadata
    const {
      clerkUserId,
      userEmail,
      sanityCustomerId,
      productIds: productIdsString,
      quantities: quantitiesString,
    } = session.metadata ?? {};

    if (!clerkUserId || !productIdsString || !quantitiesString) {
      console.error("Missing metadata in checkout session");
      return;
    }

    const productIds = productIdsString.split(",");
    const quantities = quantitiesString.split(",").map(Number);

    // Get line items from Stripe for price verification
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Create a map of product prices from line items
    const priceMap = new Map<string, number>();
    for (const item of lineItems.data) {
      const productId = item.price?.product as string | undefined;
      if (productId && item.amount_total) {
        priceMap.set(productId, item.amount_total / 100);
      }
    }

    // Build order items array
    const orderItems = productIds.map((productId, index) => ({
      _key: `item-${index}`,
      product: {
        _type: "reference" as const,
        _ref: productId,
      },
      quantity: quantities[index],
      // Use session total divided by items as fallback
      priceAtPurchase:
        priceMap.get(productId) ??
        (session.amount_total ?? 0) / 100 / productIds.length,
    }));

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Extract shipping address (from shipping_details, not customer_details)
    // Type assertion needed as Stripe types may not include shipping_details
    const shippingDetails = (
      session as unknown as {
        shipping_details?: {
          name?: string;
          address?: Stripe.Address;
        };
      }
    ).shipping_details;

    const address = shippingDetails?.address
      ? {
          name: shippingDetails.name ?? "",
          line1: shippingDetails.address.line1 ?? "",
          line2: shippingDetails.address.line2 ?? "",
          city: shippingDetails.address.city ?? "",
          postcode: shippingDetails.address.postal_code ?? "",
          country: shippingDetails.address.country ?? "",
        }
      : undefined;

    // Check if Sanity write token is configured
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      console.error("SANITY_API_WRITE_TOKEN is not configured!");
      throw new Error("SANITY_API_WRITE_TOKEN is not configured");
    }

    console.log("Creating order:", { orderNumber, itemCount: orderItems.length, total: (session.amount_total ?? 0) / 100 });

    // Create order in Sanity with customer reference
    const order = await writeClient.create({
      _type: "order",
      orderNumber,
      ...(sanityCustomerId && {
        customer: {
          _type: "reference",
          _ref: sanityCustomerId,
        },
      }),
      clerkUserId,
      email: userEmail ?? session.customer_details?.email ?? "",
      items: orderItems,
      total: (session.amount_total ?? 0) / 100,
      status: "paid",
      stripePaymentId,
      address,
      createdAt: new Date().toISOString(),
    });

    console.log(`Order created: ${order._id} (${orderNumber})`);

    // Decrease stock for all products in a single transaction
    await productIds
      .reduce(
        (tx, productId, i) =>
          tx.patch(productId, (p) => p.dec({ stock: quantities[i] })),
        writeClient.transaction()
      )
      .commit();

    console.log(`Stock updated for ${productIds.length} products`);
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error);
    throw error; // Re-throw to return 500 and trigger Stripe retry
  }
}
