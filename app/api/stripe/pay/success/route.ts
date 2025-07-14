import { stripe } from "@/lib/stripeClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // if (!id) {
    //   return NextResponse.json(
    //     { error: "Missing session_id" },
    //     { status: 400 }
    //   );
    // }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session_ = await stripe.checkout.sessions.retrieve(sessionId || "");

    const paymentIntent = await stripe.paymentIntents.retrieve(
      session_.payment_intent as string
    );

    const chargeId = paymentIntent.latest_charge; // ch_xxx
    const charge = await stripe.charges.retrieve((chargeId as string) || "");

    return NextResponse.json({
      message: "Payment successful",
      charge: charge,
    });
    // const session = await stripe.checkout.sessions.retrieve(id || "");
  } catch (error) {
    console.error("Error fetching session ID:", error);
    // return null;
    return NextResponse.json(
      { error: "Error fetching session ID:" },
      { status: 500 }
    );
  }
}

// This is from api/stripe/success/[id]/route.ts
// export async function GET(
//   request: NextRequest,
//   { params }: StripeSuccessProps
// ) {
//   const { session_id } = await params;
// }
