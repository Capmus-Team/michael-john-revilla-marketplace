"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, User, Bell, Mail, Search, List } from "lucide-react";

import { AuthContextProvider, UserAuth } from "./contexts/auth-context";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, signOut } = UserAuth();

  const router = useRouter();

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold">Marketplace</h1>
          </Link>

          <nav className="hidden md:flex items-start gap-6">
            {user && (
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Categories
              </Link>
            )}

            <Link href="/search" className="text-gray-600 hover:text-gray-900">
              Browse Products
            </Link>
            {/* <Link href="/category/electronicsxxx" className="text-gray-600 hover:text-gray-900">
              Electronics
            </Link> */}
            {user && (
              <Link
                href="/my-listings"
                className="text-gray-600 hover:text-gray-900"
              >
                My Listings
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/my-listings">
                <List className="h-5 w-5" />
              </Link>
            </Button>

            {user ? (
              <>
                <Button variant="ghost" size="icon">
                  <Mail className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.replace("/profile")}
                  size="icon"
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button asChild>
                  <Link href="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Listing
                  </Link>
                </Button>
                <Button onClick={signOut}>Logout</Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
