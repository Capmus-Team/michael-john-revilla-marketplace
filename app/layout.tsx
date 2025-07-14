import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StrictMode } from "react";
import { AuthContextProvider } from "@/components/contexts/auth-context";
import RouteController from "@/components/RouteController";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace - Buy and Sell Locally",
  description: "A modern marketplace for buying and selling items locally",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StrictMode>
      <AuthContextProvider>
        <html lang="en">
          <body className={inter.className}>
            <RouteController>{children}</RouteController>
          </body>
        </html>
      </AuthContextProvider>
    </StrictMode>
  );
}
