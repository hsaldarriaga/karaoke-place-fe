import {
  Auth0Provider,
  type AppState,
  type User,
  useAuth0,
} from "@auth0/auth0-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setTokenGetter } from "./api-client";

type AuthContextValue = {
  isConfigured: boolean;
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
  isConfigured: false,
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
  useEffect(() => {
    if (isAuthenticated) {
      setTokenGetter(() => getAccessTokenSilently());
    } else {
      setTokenGetter(null);
    }
    return () => setTokenGetter(null);
  }, [isAuthenticated, getAccessTokenSilently]);

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const hostname = import.meta.env.VITE_HOSTNAME;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  const isConfigured = Boolean(domain && clientId);

  if (!hasMounted || !isConfigured) {
    return (
      <AuthContext.Provider
        value={{
          isConfigured,
          isLoading: hasMounted ? false : isConfigured,
          isAuthenticated: false,
          login: noopAsync,
          logoutUser: noop,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: hostname,
        audience,
      }}
      onRedirectCallback={(appState?: AppState) => {
        const nextPath = getSafeReturnTo(
          typeof appState?.returnTo === "string" ? appState.returnTo : undefined,
        );

        window.history.replaceState({}, document.title, nextPath);
      }}
      cacheLocation="localstorage"
    >
      <AuthContextBridge hostname={hostname}>{children}</AuthContextBridge>
    </Auth0Provider>
  );
}

export function useAppAuth() {
  return useContext(AuthContext);
}
