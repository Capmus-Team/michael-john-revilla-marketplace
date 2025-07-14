import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { UserAuth } from "./contexts/auth-context";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const timeAgo = new Date(listing.created_at).toLocaleDateString();
  const { user } = UserAuth();
  return (
    <Link href={`/listing/${listing.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <Image
              src={listing.image_url || "/placeholder.svg?height=300&width=300"}
              alt={listing.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">
              ${listing.price.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{listing.title}</p>
            <p className="text-xs text-gray-500">{listing.location}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
