"use client";
// "use server"
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//   const [session, setSession] = useState(undefined);
//   const [user, setUser] = useState(null);

//   // Sign up
//   const signUpNewUser = async (email, password) => {
//     const { data, error } = await supabase.auth.signUp({
//       email: email.toLowerCase(),
//       password: password,
//     });

//     if (error) {
//       console.error("Error signing up: ", error);
//       return { success: false, error };
//     }

//     setUser(data.user);
//     return { success: true, data };
//   };

//   // Sign in
//   const signInUser = async (email, password) => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: email.toLowerCase(),
//         password: password,
//       });

//       // Handle Supabase error explicitly
//       if (error) {
//         console.error("Sign-in error:", error.message); // Log the error for debugging
//         return { success: false, error: error.message }; // Return the error
//       }

//       // If no error, return success
//       //console.log("Sign-in success:", data);
//       setUser(data.user);
//       setSession(data.session); // Update session state
//       return { success: true, data }; // Return the user data
//     } catch (error) {
//       // Handle unexpected issues
//       console.error("Unexpected error during sign-in:", err.message);
//       return {
//         success: false,
//         error: "An unexpected error occurred. Please try again.",
//       };
//     }
//   };

//   // useEffect(() => {
//   //   supabase.auth.getSession().then(({ data: { session } }) => {
//   //     setSession(session);
//   //   });

//   //   supabase.auth.onAuthStateChange((_event, session) => {
//   //     setSession(session);
//   //   });
//   // }, []);

//   useEffect(() => {
//     // Load session and user on mount
//     const loadSession = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       setSession(session);

//       if (session?.user) {
//         setUser(session.user); // ✅ Restore user from session
//       }
//     };

//     loadSession();

//     // Subscribe to auth state changes
//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setSession(session);
//         setUser(session?.user ?? null); // ✅ Keep user in sync with session
//       }
//     );

//     // Cleanup
//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   // Sign out
//   async function signOut() {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error("Error signing out:", error);
//     }
//   }

//   return (
//     <AuthContext.Provider
//       value={{ signUpNewUser, user, signInUser, session, signOut }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sign up
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error };
    }

    setUser(data.user);
    return { success: true, data };
  };

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        console.error("Sign-in error:", error.message); // Log the error for debugging
        return { success: false, error: error.message }; // Return the error
      }

      // If no error, return success
      //console.log("Sign-in success:", data);
      setUser(data.user);
      setSession(data.session); // Update session state
      return { success: true, data }; // Return the user data
    } catch (error) {
      // Handle unexpected issues
      console.error("Unexpected error during sign-in:", err.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (["SIGNED_IN", "TOKEN_REFRESHED"].includes(event)) {
          setSession(session);
          setUser(session?.user ?? null);
        }
        if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  //   // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading, // Expose loading state
        signUpNewUser,
        signInUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
