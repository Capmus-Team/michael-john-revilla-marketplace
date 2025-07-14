import { stripe } from "@/lib/stripeClient";
import {
  insertStripeAccount,
  supabase,
  updateStripeAccount,
} from "@/lib/supabaseClient";
import { getUserFromRequest } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1
    const user: any = await getUserFromRequest(request);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Validate existing connections
    const { data: existingAccount } = await supabase
      .from("stripe_account")
      .select("stripe_account_id")
      .eq("id", user.id)
      .single();

    if (existingAccount?.stripe_account_id) {
      const account = await stripe.accounts.retrieve(
        existingAccount.stripe_account_id
      );
      if (account.charges_enabled) {
        return NextResponse.json(
          { error: "Stripe account already connected" },
          { status: 400 }
        );
      }
    }

    // 3. Create Stripe Connect account
    // 3. Create new Stripe account
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // 4. Generate onboarding link
    const origin = request.headers.get("origin") || request.nextUrl.origin;

    //const state = crypto.randomUUID();

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${origin}/profile?stripe_reauth=true`,
      return_url: `${origin}/profile?stripe_success=true`,
      type: "account_onboarding",
      // collect: "currently_due",
      // state,
    });

    const { error } = await insertStripeAccount({
      user_id: user?.id ?? [],
      stripe_account_id: account.id ?? "",
      stripe_account_status: "pending",
      stripe_onboarding_url: accountLink.url ?? "",
      stripe_onboarding_complete: false,
    });

    // const { data, error } = await supabase.from("stripe_account").insert(
    //   {
    //     user_id: user?.id ?? [],
    //     stripe_account_id: account.id ?? "",
    //     stripe_account_status: "pending",
    //     stripe_onboarding_url: accountLink.url ?? "",
    //     stripe_onboarding_complete: false,
    //   }
    //   // { onConflict: "user_id" }
    // );

    if (error) throw error;

    // const { error } = await updateStripeAccount({
    //   user_id: user.id,
    //   stripe_account_id: account.id,
    // });

    // if (error) throw error;
    return NextResponse.json({
      accountId: account.id,
      url: accountLink.url,
      user: user ?? [],
      account: account,
    });
  } catch (error: any) {
    console.error("Error connecting to Stripe:", error);
    return NextResponse.json(
      { error: `Failed to connect to Stripe. Please try again. ${error}` },
      { status: 500 }
    );
  }
}
