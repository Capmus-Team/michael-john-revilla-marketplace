import type { Listing } from "@/lib/types";
import { ListingCard } from "./listing-card";

interface ListingsGridProps {
  listings: Listing[];
  selectedCategory: string | null;
}

export function ListingsGrid({
  listings,
  selectedCategory,
}: ListingsGridProps) {
  const filteredListings = selectedCategory
    ? listings.filter((listing) => listing.category === selectedCategory)
    : listings;

  return (
    <div className="flex-1">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          {selectedCategory || "All Categories"}
        </h2>
        <p className="text-gray-600">{filteredListings.length} items</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No listings found in this category.</p>
        </div>
      )}
    </div>
  );
}
