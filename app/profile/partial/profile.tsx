import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { UserAuth } from "@/components/contexts/auth-context";
import {
  getStripeAccount,
  getStripeDashboardLink,
  updateStripeAccount,
} from "@/lib/supabaseClient";
import { set } from "date-fns";
import { useSearchParams } from "next/navigation";
import Stripe from "stripe";
import { stripe } from "@/lib/stripeClient";

interface StripeAccount {
  stripe_account_id: string | "";
  stripe_account_status: string;
  stripe_onboarding_url: string;
  stripe_onboarding_complete: boolean;
}

export default function ProfilePage() {
  const { user, session } = UserAuth();

  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("stripe_success") || ""
  );

  useEffect(() => {
    if (searchQuery == "true" && user) {
      const updateStripe = async () => {
        const { stripe_account_id }: any = await getStripeAccount(user.id); // check from database
        // console.log("id:", stripe_account_id);
        const account = await stripe.accounts.retrieve(stripe_account_id);

        //console.log("Stripe Account!!!:", account);

        await updateStripeAccount({
          user_id: user.id,
          stripe_onboarding_complete: account?.details_submitted || false,
          stripe_account_status: account?.details_submitted
            ? "active"
            : "pending",
        });
        if (account?.details_submitted) {
          // Update the local state or perform any other actions needed
          alert("Stripe account connected successfully!");
        }
      };
      updateStripe();
      //
    }
  }, []);

  const [stripe_account, setStripeAccount] = useState<StripeAccount>();

  useEffect(() => {
    // console.log("User:", user);
    const fetchStripeAccount = async () => {
      setStripeAccount((await getStripeAccount(user.id || "")) as any);
    };
    fetchStripeAccount();
  }, [user]);

  useEffect(() => {
    console.log("Stripe Account:", stripe_account);
  }, [stripe_account]);

  const [formData, setFormData] = useState({});

  const [connecting, setIsConnecting] = useState(false);

  // connect to stripe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    // console.log("token:", session?.access_token || session?.refresh_token);
    try {
      const response = await fetch("/api/stripe/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error("Failed to connect to Stripe");
      }
      const { url, user, account } = await response.json();
      // console.log({ url: url, user: user, account: account });
      window.location.href = url; // Redirect to Stripe Connect

      //alert("Connected to Stripe successfully!");
    } catch (error) {
      console.error("Error connecting to Stripe:", error);
      alert("Failed to connect to Stripe. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRedirectToDashboard = async () => {
    setIsRedirecting(true);
    try {
      //  if (!stripe_account?.stripe_onboarding_complete) {
      //     alert("Please complete the Stripe onboarding process first.");
      //     return;
      //   }

      const dashboardUrl = await getStripeDashboardLink(
        stripe_account?.stripe_account_id ?? ""
      );

      window.open(dashboardUrl, "_blank");
      // await getStripeDashboardLink(
      //   stripe_account.stripe_account_id
      // );
      // window.location.href = dashboardUrl;
    } catch (error) {
      console.error("Error redirecting to Stripe dashboard:", error);
      alert("Failed to redirect to Stripe dashboard. Please try again.");
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* <div>
        <Label htmlFor="buyerName">Your Name</Label>
        <Input
          id="buyerName"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="buyerEmail">Your Email</Label>
        <Input
          id="buyerEmail"
          type="email"
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          className="resize-none"
        />
      </div> */}

      <div>
        {!stripe_account?.stripe_onboarding_complete ? (
          <>
            <Label htmlFor="message">Connect to Stripe</Label>
            <Button type="submit" disabled={connecting} className="w-full mt-2">
              {connecting ? "Connecting..." : "Connect"}
            </Button>
          </>
        ) : (
          <>
            <p className="font-medium text-sm">
              Stripe Account: {stripe_account?.stripe_account_id}
            </p>
            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={
                  stripe_account.stripe_onboarding_complete
                    ? "text-green-600 font-medium"
                    : "text-orange-600 font-medium"
                }
              >
                {stripe_account.stripe_onboarding_complete
                  ? "Active"
                  : stripe_account.stripe_account_status || "Pending"}
              </span>
            </p>
            <Button
              type="button"
              onClick={handleRedirectToDashboard}
              disabled={isRedirecting}
              className="w-full mt-2"
            >
              {isRedirecting ? "Redirecting" : "Go to Stripe Dashboard"}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
