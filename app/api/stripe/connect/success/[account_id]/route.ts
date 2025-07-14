import {
  getUserFromRequest,
  retrieveStripeAccount,
  upsertStripeAccount,
} from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { account_id: string } }
) {
  try {
    const { account_id } = params;

    // Retrieve Stripe account details
    const account = await retrieveStripeAccount(account_id);
    if (!account) {
      throw new Error("Stripe account not found");
    }

    // Get user from session
    const user = await getUserFromRequest(request);
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    // Update database
    await upsertStripeAccount(
      user.id,
      account.id,
      "active"
      // Add other fields you want to store
    );

    // Redirect to success page
    const successUrl = new URL("/profile?stripe=success", request.url);
    return NextResponse.redirect(successUrl);
  } catch (err) {
    console.error("Stripe success handler error:", err);

    // Redirect to error page
    const errorUrl = new URL("/profile?stripe=error", request.url);
    return NextResponse.redirect(errorUrl);
  }
}
