import {
  Auth0Provider,
  type AppState,
  type User,
  useAuth0,
} from "@auth0/auth0-react";
import { createContext, use, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { useConfigureAxios } from "~/lib/api-client";

type AuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: User;
  error?: string;
  login: (returnTo?: string) => Promise<void>;
  logoutUser: () => void;
};

const DEFAULT_RETURN_TO = "/";

const noopAsync = async (_returnTo?: string) => undefined;
const noop = () => undefined;

function getSafeReturnTo(returnTo?: string) {
  return returnTo?.startsWith("/") ? returnTo : DEFAULT_RETURN_TO;
}

const AuthContext = createContext<AuthContextValue>({
  isLoading: false,
  isAuthenticated: false,
  login: noopAsync,
  logoutUser: noop,
});

function AuthContextBridge({
  children,
  hostname,
}: {
  children: React.ReactNode;
  hostname?: string;
}) {
  const {
    error,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  // Register / unregister the token getter so the axios interceptor can
  // attach a Bearer token to every outgoing request.
  useConfigureAxios(isAuthenticated ? getAccessTokenSilently : null);

  const value = useMemo<AuthContextValue>(
    () => ({
      isConfigured: true,
      isLoading,
      isAuthenticated,
      user,
      error: error?.message,
      login: (returnTo?: string) =>
        loginWithRedirect({
          appState: {
            returnTo: getSafeReturnTo(returnTo),
          },
        }),
      logoutUser: () =>
        logout({
          logoutParams: {
            returnTo: hostname,
          },
        }),
    }),
    [
      error,
      hostname,
      isAuthenticated,
      isLoading,
      loginWithRedirect,
      logout,
      user,
    ],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const hostname = import.meta.env.VITE_HOSTNAME;
  const navigate = useNavigate();

  const handleRedirectCallback = useCallback(
    (appState?: AppState) => {
      navigate(
        getSafeReturnTo(
          typeof appState?.returnTo === "string"
            ? appState.returnTo
            : undefined,
        ),
        { replace: true },
      );
    },
    [navigate],
  );

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: hostname,
        audience,
      }}
      onRedirectCallback={handleRedirectCallback}
      cacheLocation="localstorage"
    >
      <AuthContextBridge hostname={hostname}>{children}</AuthContextBridge>
    </Auth0Provider>
  );
}

export function useAppAuth() {
  return use(AuthContext);
}
