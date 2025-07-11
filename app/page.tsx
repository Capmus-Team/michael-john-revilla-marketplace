"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { CategorySidebar } from "@/components/category-sidebar";
import { ListingsGrid } from "@/components/listings-grid";
import type { Listing } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { DatabaseSetup } from "@/components/database-setup";
import { SAMPLE_LISTINGS } from "@/lib/sample-data";

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // If there's an error (like table doesn't exist), use sample data
        console.log("Using sample data:", error.message);
        setListings(SAMPLE_LISTINGS);
        return;
      }

      setListings(data || SAMPLE_LISTINGS);
    } catch (error) {
      console.error("Error fetching listings, using sample data:", error);
      setListings(SAMPLE_LISTINGS);
    } finally {
      setLoading(false);
    }
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
        {showSetup && <DatabaseSetup />}
        <div className="flex gap-6">
          <CategorySidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <ListingsGrid
            listings={listings}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
}
