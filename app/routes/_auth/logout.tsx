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
  const { error, isLoading, logoutUser } = useAppAuth();
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (hasTriggeredRef.current || isLoading) {
      return;
    }

    hasTriggeredRef.current = true;
    logoutUser();
  }, [isLoading, logoutUser]);

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
