// utils/withAuth.tsx
"use client";

import { useRouter } from "next/navigation";
import { UserAuth } from "@/components/contexts/auth-context";
import { useEffect } from "react";

export function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const { user, AuthLoading } = UserAuth();
    const router = useRouter();

    useEffect(() => {
      if (!AuthLoading && !user) {
        router.push("/login");
      }
    }, [AuthLoading, user, router]);

    if (AuthLoading || !user) {
      return <div>Loading...</div>; // Or a loading spinner
    }

    return <Component {...props} />;
  };
}
