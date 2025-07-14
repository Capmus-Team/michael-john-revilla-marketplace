"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage =
    searchParams?.get("error") || "An unknown error occurred";

  // Provide more detailed explanations for common errors
  const errorExplanation = () => {
    switch (errorMessage) {
      case "missing_code":
        return "The verification link is missing required parameters. Please make sure you are using the complete link from the email.";
      case "configuration":
        return "There is a configuration issue with the authentication service. Please contact support.";
      case "server_error":
        return "The server encountered an error while processing your request. Please try again later.";
      default:
        return "If you continue to experience issues, please contact support.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verification Error
          </h1>
          <div className="mb-6 text-red-600 text-5xl">✗</div>
          <p className="text-gray-600 mb-3">
            There was a problem verifying your email:{" "}
            <span className="text-red-500">{errorMessage}</span>
          </p>
          <p className="text-gray-600 mb-6">{errorExplanation()}</p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/signin"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </Link>
            <Link
              href="/auth/signup"
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Sign Up Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
