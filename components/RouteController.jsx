"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserAuth } from "./contexts/auth-context";

const RouteController = ({ children }) => {
  const { session, user } = UserAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (session === undefined) return; // Still loading auth state

    const protectedRoutes = ["/create", "/my-listings", "/profile", "/listing"];

    const guestRoutes = ["/login", "/sign-up", "/sign-in"];

    const isProtected = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAuthRoute = guestRoutes.some((route) => pathname.startsWith(route));

    if (isProtected && !user) {
      router.replace("/sign-in");
      return;
    }

    if (isAuthRoute && user) {
      router.replace("/");
      return;
    }

    setIsCheckingAuth(false);
  }, [session, user, router, pathname]);

  if (session === undefined || isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteController;
