import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";

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
  const { error, isLoading, login } = useAppAuth();
  const [searchParams] = useSearchParams();
  const hasTriggeredRef = useRef(false);
  const returnTo = searchParams.get("returnTo") ?? "/";

  useEffect(() => {
    if (hasTriggeredRef.current || isLoading) {
      return;
    }

    hasTriggeredRef.current = true;
    void login(returnTo);
  }, [isLoading, login, returnTo]);

  if (error) {
    return <AuthActionState title="Login failed" description={error} />;
  }

  return (
    <AuthActionState
      title="Redirecting to login..."
      description="You are being sent to Auth0 to sign in."
    />
  );
}
