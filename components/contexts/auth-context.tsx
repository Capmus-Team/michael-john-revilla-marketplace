// contexts/auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createServerClient, supabase } from "@/lib/supabase";

interface SignInCredentials {
  email: string;
  password: string;
}

type AuthContextType = {
  user: any;
  isLoading: boolean;
  signIn: (credentials: SignInCredentials) => {};
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async (credentials: SignInCredentials) => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session and set user
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      setIsLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  //   const signIn = async () => {
  //     await supabase.auth.signInWithOAuth({
  //       provider: "github",
  //       options: {
  //         redirectTo: `${location.origin}/auth/callback`,
  //       },
  //     });
  //   };
  const signIn = async (credentials: SignInCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      throw error;
    }

    return data;
  };
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
