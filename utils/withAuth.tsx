// utils/withAuth.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/contexts/auth-context";
import { useEffect } from "react";

export function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push("/login");
      }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
      return <div>Loading...</div>; // Or a loading spinner
    }

    return <Component {...props} />;
  };
}
