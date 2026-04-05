import { Navigate, Outlet, useLocation } from "react-router";

import { AuthActionState } from "../components/auth-action-state";
import { useAppAuth } from "../lib/auth";

export default function ProtectedLayout() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAppAuth();

  if (isLoading) {
    return (
      <AuthActionState
        title="Checking your session..."
        description="Please wait while we verify your authentication."
      />
    );
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  return <Outlet />;
}
