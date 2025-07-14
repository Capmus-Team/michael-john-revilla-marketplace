import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  confirmpw: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
// FROM listings SCHEMA
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: "listings" },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server-side client for API routes

// GET PUBLIC SCHEMA
// export const createServerClient = () => {
//   return createClient(supabaseUrl, supabaseAnonKey, {
//     db: { schema: "auth" },
//   });
// };

export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
};

export const signUp = async (credentials: SignUpCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });
  if (error) {
    throw error;
  }

  return data;
  //return { user: data.user, session: data.session };
};
