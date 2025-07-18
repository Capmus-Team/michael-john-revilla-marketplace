"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { SAMPLE_LISTINGS } from "@/lib/sample-data";
import { UserAuth } from "@/components/contexts/auth-context";
import { List } from "postcss/lib/list";
import EditPage from "./edit/[id]/page";

export default function MyListingsPage() {
  const [listings, setListings] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { user } = UserAuth();

  // useEffect(() => {
  //   // In a real app, you'd get this from authentication
  //   // const email =
  //   //   localStorage.getItem("userEmail") || "michaeljohnrevilla1233@gmail.com";
  //   // setUserEmail(email);
  //   // fetchUserListings(email);

  // }, []);

  // const listings = useMemo(async () => {
  //   setLoading(true);
  //   try {
  //     const { data, error } = await supabase
  //       .from("listings")
  //       .select("*")
  //       .eq("user_id", user.id)
  //       .order("created_at", { ascending: false });

  //     return data || [];
  //   } catch (err) {
  //     console.error(err);
  //     return [];
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [user]);

  // useEffect(() => {
  //   setListings(listings_);
  // }, [listings_]);

  const fetchUserListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // if (error) {
      //   // Fallback to sample data filtered by user
      //   const userListings = SAMPLE_LISTINGS.filter(
      //     (listing) => listing.seller_email === email
      //   );
      //   setListings(userListings);
      //   return;
      // }

      setListings(data || []);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      // Fallback to sample data
      const userListings = SAMPLE_LISTINGS.filter(
        (listing) => listing.seller_email === userEmail
      );
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, []);

  // const handleDeleteListing = async (listingId: string) => {
  //   if (!confirm("Are you sure you want to delete this listing?")) return;

  //   try {
  //     const { error } = await supabase
  //       .from("listings")
  //       .delete()
  //       .eq("id", listingId);

  //     if (error) throw error;

  //     setListings(
  //       listings.filter((listing: Listing) => listing.id !== listingId)
  //     );
  //   } catch (error) {
  //     console.error("Error deleting listing:", error);
  //     alert("Failed to delete listing. Please try again.");
  //   }
  // };

  const filteredListings = listings.filter(
    (listing: Listing) =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">My Listings</h1>
            <Button asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                Create New Listing
              </Link>
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{listings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {listings.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {listings
                    .reduce(
                      (sum: number, listing: Listing) => sum + listing.price,
                      0
                    )
                    .toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {filteredListings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "You haven't created any listings yet."}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Listing
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing: Listing) => (
              <Card key={listing.id} className="p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={
                        listing.image_url ||
                        "/placeholder.svg?height=128&width=128"
                      }
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {listing.title}
                        </h3>
                        <p className="text-2xl font-bold text-green-600 mb-2">
                          ${listing.price.toLocaleString()}
                        </p>
                        <Badge variant="secondary" className="mb-2">
                          {listing.category}
                        </Badge>
                        <p className="text-gray-600 text-sm mb-2">
                          Listed{" "}
                          {new Date(listing.created_at).toLocaleDateString()}
                        </p>
                        {listing.description && (
                          <p className="text-gray-700 line-clamp-2">
                            {listing.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsOpen(true)}
                        >
                          <Link href={`/listing/${listing.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          // onClick={() => handleDeleteListing(listing.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* <EditPage params={{ id: "1" }} isOpen={!isOpen} /> */}
    </div>
  );
}
