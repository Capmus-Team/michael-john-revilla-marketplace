"use client";

import { Header } from "@/components/header";
import { CreateListingForm } from "@/components/create-listing-form";
import { useRouter } from "next/navigation";

export default function CreateItemPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <CreateListingForm onSuccess={() => router.replace("/my-listings")} />
      </div>
    </div>
  );
}
