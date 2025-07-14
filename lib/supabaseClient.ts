import { createClient } from "@supabase/supabase-js";
import { stripe } from "./stripeClient";
import { NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: "listings" },
});

export const getStripeAccount = async (userId: string) => {
  const { data, error } = await supabase
    .from("stripe_account")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching Stripe account:", error);
    return data;
  }

  return data;
};

export const createStripeAccount = async (userId: string) => {
  const account = await stripe.accounts.create({
    country: "US",
    email: "jenny.rosen@example.com",
    controller: {
      fees: {
        payer: "application",
      },
      losses: {
        payments: "application",
      },
      stripe_dashboard: {
        type: "express",
      },
    },
  });
};

// Retrieves the user ID from the request
export async function getUserFromRequest(request: NextRequest) {
  try {
    // Try to get the session token from the authorization header
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      if (data?.user && !error) {
        return data.user;
      }
    }

    // If no token or invalid token, try to get session cookie directly
    const { data, error } = await supabase.auth.getSession();
    if (data?.session?.user && !error) {
      return data.session.user;
    }

    return null;
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
}

export async function insertStripeAccount(
  inserts: Partial<any> & { user_id?: string }
) {
  try {
    // // Get the user_id from the updates object
    // const userId = inserts.user_id;

    // if (!userId) {
    //   throw new Error("User ID is required to update stripe account");
    // }

    // Remove the id field from updates if present
    const { ...stripeInserts } = inserts;

    const { data, error } = await supabase
      .from("stripe_account")
      .upsert(stripeInserts, { onConflict: "user_id" })
      .select()
      .single();
    if (error) {
      console.error("Error updating stripe account:", error);
      throw error;
    }
    return { data, error };
  } catch (err) {
    console.error("Error inserting Stripe account:", err);
    throw err;
  }
}

export async function upsertStripeAccount(
  user_id: string,
  stripe_account_id: string,
  stripe_account_status: "pending" | "active"
) {
  const { data, error } = await supabase
    .from("stripe_account")
    .upsert(
      { user_id, stripe_account_id, stripe_account_status },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Error inserting Stripe account:", error);
    throw error;
  }

  return data;
}

// Function to update a user's profile
export async function updateStripeAccount(
  updates: Partial<any> & { id?: string }
): Promise<any | null> {
  // Get the user_id from the updates object
  const userId = updates.id || updates.user_id;

  if (!userId) {
    throw new Error("User ID is required to update stripe account");
  }

  // Remove the id field from updates if present
  const { user_id, ...stripeUpdates } = updates;

  const { data, error } = await supabase
    .from("stripe_account")
    .update(stripeUpdates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating stripe account:", error);
    throw error;
  }

  return { data, error };
}

export async function retrieveStripeAccount(accId: string) {
  try {
    const account = await stripe.accounts.retrieve(accId);
    return account;
  } catch (error) {
    console.error("Error retrieving Stripe account:", error);
    return null;
  }
}

export async function getStripeDashboardLink(accountId: string) {
  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId);
    return loginLink.url;
  } catch (error) {
    console.error("Error creating Stripe login link:", error);
    throw new Error("Failed to generate Stripe dashboard link");
  }
}

export async function getUser(userID: string) {
  try {
    const user = await supabase
      .from("users")
      .select("*")
      .eq("id", userID)
      .single();

    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}
