import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/header";
import { MessageForm } from "@/components/message-form";
import { supabase } from "@/lib/supabase";
import type { Listing } from "@/lib/types";
import { SAMPLE_LISTINGS } from "@/lib/sample-data";

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

async function getListing(id: string): Promise<Listing | null> {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // If database error, try to find in sample data
      const sampleListing = SAMPLE_LISTINGS.find(
        (listing) => listing.id === id
      );
      return sampleListing || null;
    }

    return data;
  } catch (error) {
    // Fallback to sample data
    const sampleListing = SAMPLE_LISTINGS.find((listing) => listing.id === id);
    return sampleListing || null;
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listing = await getListing(id);

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
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <p className="text-4xl font-bold text-green-600 mb-4">
                  ${listing.price.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  Listed {timeAgo} in {listing.location}
                </p>
              </div>

              {listing.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{listing.description}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Seller Information</h3>
                <p className="text-gray-700">
                  {listing.seller_name || "Anonymous Seller"}
                </p>
              </div>

              <MessageForm
                listingId={listing.id}
                sellerEmail={listing.seller_email}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
