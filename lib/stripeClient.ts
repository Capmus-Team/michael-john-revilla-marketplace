import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeApiVersion = "2025-06-30.basil";

if (!stripeSecretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is missing. Please add it to your environment variables."
  );
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: stripeApiVersion as any,
});

// //console.log({ stripeSecretKey, stripeApiVersion });
// app/actions/stripe-login.ts
// "use server";
