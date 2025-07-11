"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { ListingCard } from "@/components/listing-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Listing } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { SAMPLE_LISTINGS } from "@/lib/sample-data";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [categorySlug, setCategorySlug] = useState("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setCategorySlug(resolvedParams.slug);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryListings();
    }
  }, [categorySlug]);

  useEffect(() => {
    filterAndSortListings();
  }, [listings, searchQuery, sortBy]);

  const categoryName = categorySlug
    ? CATEGORIES.find(
        (cat) => cat.toLowerCase().replace(/\s+/g, "-") === categorySlug
      ) ||
      categorySlug.charAt(0).toUpperCase() +
        categorySlug.slice(1).replace(/-/g, " ")
    : "";

  // Check if category exists
  if (
    categorySlug &&
    !CATEGORIES.some(
      (cat) => cat.toLowerCase().replace(/\s+/g, "-") === categorySlug
    )
  ) {
    notFound();
  }

  const fetchCategoryListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("category", categoryName)
        .order("created_at", { ascending: false });

      if (error) {
        const categoryListings = SAMPLE_LISTINGS.filter(
          (listing) =>
            listing.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
        );
        setListings(categoryListings);
        return;
      }

      setListings(data || []);
    } catch (error) {
      console.error("Error fetching category listings:", error);
      const categoryListings = SAMPLE_LISTINGS.filter(
        (listing) =>
          listing.category.toLowerCase().replace(/\s+/g, "-") === categorySlug
      );
      setListings(categoryListings);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortListings = () => {
    let filtered = [...listings];

    // Text search within category
    if (searchQuery) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    setFilteredListings(filtered);
  };

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
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-3xl font-bold">{categoryName}</h1>
            <Badge variant="secondary">{filteredListings.length} items</Badge>
          </div>

          {/* Search and Sort */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={`Search in ${categoryName}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {filteredListings.length}{" "}
              {filteredListings.length === 1 ? "item" : "items"} in{" "}
              {categoryName}
            </p>
          </div>

          {filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-gray-600">
                {searchQuery
                  ? `No items match "${searchQuery}" in ${categoryName}.`
                  : `No items available in ${categoryName} yet.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
