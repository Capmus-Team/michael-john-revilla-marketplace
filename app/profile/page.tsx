"use client";
import { Header } from "@/components/header";
import ProfilePage from "./partial/profile";
import { UserAuth } from "@/components/contexts/auth-context";

export default function profile() {
  const { user } = UserAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <p className="text-gray-600 mb-6">
              Manage your account settings and preferences.
            </p>
            <div>
              <p className="font-medium text-sm">Email: {user?.email}</p>
            </div>
            <hr className="mb-2" />
            <div className=" grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfilePage />
            </div>
            {/* Profile form or content goes here */}
          </div>
        </div>
      </div>
    </div>
  );
}
