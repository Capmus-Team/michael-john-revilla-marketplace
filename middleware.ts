import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "./lib/supabase";

export async function middleware(request: NextRequest) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes
  const protectedRoutes = ["/create", "/my-listings", "/profile"];
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
