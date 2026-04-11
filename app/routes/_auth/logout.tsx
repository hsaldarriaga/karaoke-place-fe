import { useEffect, useRef } from "react";

import { AuthActionState } from "~/components/auth-action-state";
import { useAppAuth } from "~/lib/auth";
import type { Route } from "./+types/logout";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Logout | Karaoke Place" },
    {
      name: "description",
      content: "Redirecting to Auth0 to sign out.",
    },
  ];
}

export default function LogoutPage() {
  const { error, isConfigured, isLoading, logoutUser } = useAppAuth();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current || !isConfigured || isLoading) {
      return;
    }

    hasTriggered.current = true;
    logoutUser();
  }, [isConfigured, isLoading, logoutUser]);

  if (!isConfigured) {
    return (
      <AuthActionState
        title="Auth0 is not configured"
        description="Set your Auth0 variables in .env before using the logout page."
      />
    );
  }

  if (error) {
    return <AuthActionState title="Logout failed" description={error} />;
  }

  return (
    <AuthActionState
      title="Signing you out..."
      description="You are being signed out of Auth0."
    />
  );
}
