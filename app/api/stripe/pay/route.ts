import { stripe } from "@/lib/stripeClient";
import { Post } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  // Parse the request body
  const {
    amount,
    currency = "eur",
    buyer_stripe_acc_id,
    seller_stripe_acc_id,
    success_url,
    cancel_url,
    products,
    buyer_email,
    listingId,
  } = await request.json();

  try {
    if (!seller_stripe_acc_id) {
      alert("seller has no active stripe_id");
      throw new Error("asd");
    }

    // Validate input
    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { error: "Amount must be a valid number (in cents)" },
        { status: 400 }
      );
    }

    const lineitems = products?.map((post: Post) => ({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(post.price * 100), // Ensure integer
        product_data: {
          name: post?.title,
          description: post?.description,
          images: [post?.image_url ?? ""], //should be an array
        },
      },
    }));

    const customer = await stripe.customers.create({
      email: buyer_email ?? "",
      // metadata: { your_internal_user_id: "user_123" }, // Link to your DB
    });

    if (!seller_stripe_acc_id) {
      throw new Error("Seller has no stripe_account");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineitems,
      mode: "payment",
      success_url: success_url, //`${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url, //`${window.location.origin}/cancel`,

      // Payment Destination (Where the platform fee go)

      payment_intent_data: {
        application_fee_amount: 1000, // $10.000
        transfer_data: {
          destination: seller_stripe_acc_id, // Seller's connected account ID
        },
        on_behalf_of: seller_stripe_acc_id,
      },

      customer: customer?.id,
      metadata: {
        seller_stripe_acc_id: seller_stripe_acc_id,
        post_id: products?.map((post: Post) => post?.id).join(","),
      },
    });

    return NextResponse.json({
      //   clientSecret: paymentIntent.client_secret,
      //   amount: paymentIntent.amount,
      //   currency: paymentIntent.currency,
      //buyerData: (await stripe.accounts.retrieve(buyer_stripe_acc_id)) ?? {},
      sellerData: (await stripe.accounts.retrieve(seller_stripe_acc_id)) ?? {},
      session: session?.id ?? "",
      //   testData: (await getConnectAccount(buyer_stripe_acc_id)) ?? {},
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }

  //   const searchParams = new URL(request.url).searchParams;
  //   const sessionId = searchParams.get("session_id");

  //   if (!sessionId) {
  //     return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  //   }

  //   try {
  //     const session = await stripe.checkout.sessions.retrieve(sessionId);
  //     // Process the session data as needed
  //     return NextResponse.json({ session }, { status: 200 });
  //   } catch (error) {
  //     console.error("Error fetching session ID:", error);
  //     return NextResponse.json(
  //       { error: "Failed to retrieve session" },
  //       { status: 500 }
  //     );
  //   }
}
