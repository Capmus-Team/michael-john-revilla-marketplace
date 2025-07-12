import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// FROM listings SCHEMA
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: "listings" },
});
// Server-side client for API routes

// GET PUBLIC SCHEMA
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};
