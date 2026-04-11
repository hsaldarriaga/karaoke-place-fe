import { useEffect, useRef } from "react";
import { Navigate, useSearchParams } from "react-router";

import { AuthActionState } from "~/components/auth-action-state";
import { useAppAuth } from "~/lib/auth";
import type { Route } from "./+types/login";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Login | Karaoke Place" },
    {
      name: "description",
      content: "Redirecting to Auth0 to sign in.",
    },
  ];
}

export default function LoginPage() {
  const { error, isAuthenticated, isLoading, login } = useAppAuth();
  const [searchParams] = useSearchParams();
  const hasTriggered = useRef(false);
  const returnTo = searchParams.get("returnTo") ?? "/";

  useEffect(() => {
    if (hasTriggered.current || isLoading || isAuthenticated) {
      return;
    }

    hasTriggered.current = true;
    void login(returnTo);
  }, [isAuthenticated, isLoading, login, returnTo]);

  if (error) {
    return <AuthActionState title="Login failed" description={error} />;
  }

  if (isAuthenticated) {
    return <Navigate to={returnTo} replace />;
  }

  return (
    <AuthActionState
      title="Redirecting to login..."
      description="You are being sent to Auth0 to sign in."
    />
  );
}
