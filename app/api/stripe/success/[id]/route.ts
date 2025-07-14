import { stripe } from "@/lib/stripeClient";
import { NextRequest, NextResponse } from "next/server";

async function getSessionID(id: string) {
  try {
    if (!id) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(id || "");
  } catch (error) {
    console.error("Error fetching session ID:", error);
    return null;
  }
}

// This is from api/stripe/success/[id]/route.ts
// export async function GET(
//   request: NextRequest,
//   { params }: StripeSuccessProps
// ) {
//   const { session_id } = await params;
// }
