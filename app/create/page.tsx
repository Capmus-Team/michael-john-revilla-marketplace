"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { CreateListingForm } from "@/components/create-listing-form";
import PrivateRoute from "@/components/RouteController";
export default function CreateListingPage() {
  const [step, setStep] = useState<"type" | "form">("form"); // Skip type selection for now
  const [listingType, setListingType] = useState<string>("item");
  const router = useRouter();

  const listingTypes = [
    { id: "item", label: "Item for sale", description: "Sell a single item" },
    {
      id: "multiple",
      label: "Create multiple listings",
      description: "Create multiple listings at once",
    },
    {
      id: "vehicle",
      label: "Vehicle for sale",
      description: "Sell a car, truck, or motorcycle",
    },
    {
      id: "home",
      label: "Home for sale or rent",
      description: "List property for sale or rent",
    },
  ];

  if (step === "form") {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <CreateListingForm onSuccess={() => router.replace("/my-listings")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Create new listing</h1>
              <div className="flex gap-8 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  Choose listing type
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  Your listings
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  Seller help
                </span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Choose listing type</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {listingTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setListingType(type.id);
                    setStep("form");
                  }}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold mb-2">{type.label}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
