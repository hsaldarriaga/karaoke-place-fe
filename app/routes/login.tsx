import { useEffect, useRef } from "react";
import { Navigate } from "react-router";

import { AuthActionState } from "../components/auth-action-state";
import { useAppAuth } from "../lib/auth";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | Karaoke Place" },
    {
      name: "description",
      content: "Redirecting to Auth0 to sign in.",
    },
  ];
}

export default function LoginPage() {
  const { error, isAuthenticated, isConfigured, isLoading, login } = useAppAuth();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current || !isConfigured || isLoading || isAuthenticated) {
      return;
    }

    hasTriggered.current = true;
    login();
  }, [isAuthenticated, isConfigured, isLoading, login]);

  if (!isConfigured) {
    return (
      <AuthActionState
        title="Auth0 is not configured"
        description="Set your Auth0 variables in .env before using the login page."
      />
    );
  }

  if (error) {
    return <AuthActionState title="Login failed" description={error} />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthActionState
      title="Redirecting to login..."
      description="You are being sent to Auth0 to sign in."
    />
  );
}
