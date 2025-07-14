"use client"; // <-- Add this at the very top

import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/header";
import { MessageForm } from "@/components/message-form";
import { supabase } from "@/lib/supabaseClient";
import type { Listing } from "@/lib/types";
import { SAMPLE_LISTINGS } from "@/lib/sample-data";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { UserAuth } from "@/components/contexts/auth-context";
import { getStripeAccount } from "@/lib/supabaseClient";
import { stripe } from "@/lib/stripeClient";
import { loadStripe } from "@stripe/stripe-js";

export default function ListingPage({ params }: { params: { id: string } }) {
  const { user } = UserAuth(); // Now using the auth context
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [isBuying, setIsBuying] = useState(false);

  //const [userSeller, setUserSeller] = useState({});

  const [sellerStripeAccount, setSellerStripeAccount] = useState<any>({});

  const fetchUserSeller = async () => {};

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error || !data) {
          const sampleListing = SAMPLE_LISTINGS.find((l) => l.id === params.id);
          if (!sampleListing) {
            notFound();
          }
          setListing(sampleListing);
        } else {
          setListing(data);
        }

        const { data: sellerStripe, error: errorSeller } = await supabase
          .from("stripe_account")
          .select("*")
          .eq("user_id", data?.user_id)
          .single();

        ////console.log("data:", data, sellerStripe);
        setSellerStripeAccount(sellerStripe);
      } catch (error) {
        const sampleListing = SAMPLE_LISTINGS.find((l) => l.id === params.id);
        setListing(sampleListing || null);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  useEffect(() => {
    if (sellerStripeAccount) {
      //console.log("sellerStripeAccount fetched:", sellerStripeAccount);
    }
  }, [sellerStripeAccount]);

  const handleBuyClick = async () => {
    // alert("Buy button clicked!");
    // //console.log("Listing:", listing);
    // return;

    if (!user) {
      return;
    }

    setIsBuying(true);
    try {
      const response = await fetch("/api/stripe/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: listing?.id,
          amount: listing?.price,
          sellerId: listing?.user_id,
          products: [listing], // should be []
          seller_stripe_acc_id: sellerStripeAccount?.stripe_account_id,
          // buyer_stripe_acc_id
          success_url: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}&checkout=success`,
          cancel_url: `${window.location.origin}/?checkout=false`,
        }),
      });

      // const datax = await response.json();
      // //console.log("response:", datax);
      // return;
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
      );

      const data = await response.json();
      // //console.log("RESPONSE!!:", stripe?.accou);

      const result: any = await stripe?.redirectToCheckout({
        sessionId: data.session,
      });

      if (result.error) {
        window.alert(result?.error?.message);
      }
    } catch (error) {
      console.error("Error during purchase:", error);
    } finally {
      setIsBuying(false);
    }
  };

  // useEffect(() => {
  //   const getStripeAcc = async () => {
  //     const acc = await getStripeAccount(listing?.user_id || "");
  //     return acc;
  //   };

  //   setUserSeller(getStripeAcc());
  // }, [listing]);

  // useEffect(() => {
  //   if (userSeller) {
  //     //console.log("User Seller:", userSeller.json());
  //   }
  // }, [userSeller]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    notFound();
  }

  const timeAgo = new Date(listing.created_at).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image section remains the same */}
            <div className="aspect-square relative">
              <Image
                src={
                  listing.image_url || "/placeholder.svg?height=600&width=600"
                }
                alt={listing.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <div className="space-y-6">
              {/* Title and price section */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <p className="text-4xl font-bold text-green-600 mb-4">
                  ${listing.price.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Listed {timeAgo} in {listing.location}
                </p>
              </div>

              {/* Description section */}
              {listing.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{listing.description}</p>
                </div>
              )}

              {/* Seller information */}
              <div>
                <h3 className="font-semibold mb-2">Seller Information</h3>
                <p className="text-gray-700">
                  <div>Name: {listing.seller_name || "Anonymous Seller"}</div>
                  {/* <div>Email: {listing.seller_name || "Anonymous Seller"}</div> */}
                </p>
              </div>

              {/* Buy button - only show if not the owner */}
              {sellerStripeAccount?.stripe_onboarding_complete &&
                sellerStripeAccount?.user_id !== user?.id && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleBuyClick}
                      type="button"
                      className="w-full"
                      disabled={isBuying}
                    >
                      {isBuying
                        ? "Buying..."
                        : `Buy $${listing.price.toLocaleString()}`}{" "}
                    </Button>
                  </div>
                )}

              {!sellerStripeAccount?.stripe_onboarding_complete &&
                listing.user_id !== user?.id && (
                  <div className="text-red-600">
                    Seller has no stripe account active yet
                  </div>
                )}
              {sellerStripeAccount?.user_id !== user?.id && (
                <MessageForm
                  listingId={listing.id}
                  sellerEmail={listing.seller_email}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
