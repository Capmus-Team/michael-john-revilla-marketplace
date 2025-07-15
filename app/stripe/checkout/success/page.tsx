"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default async function SuccessPage(request: Request) {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  //const sessionId = searchParams.get("session_id");

  //   const { sessionId } = await request.json();
  //   if (!sessionId) {
  //     return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  //   }
  //   const session = await stripe.checkout.sessions.retrieve(sessionId || "");

  //   const paymentIntent = await stripe.paymentIntents.retrieve(
  //     session.payment_intent as string
  //   );

  //   const chargeId = paymentIntent.latest_charge; // ch_xxx
  //   const charge = await stripe.charges.retrieve((chargeId as string) || "");
}
