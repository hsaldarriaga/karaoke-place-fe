import {
  Auth0Provider,
  type AppState,
  type User,
  useAuth0,
} from "@auth0/auth0-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextValue = {
  isConfigured: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: User;
  error?: string;
  login: () => Promise<void>;
  logoutUser: () => void;
};

const noopAsync = async () => undefined;
const noop = () => undefined;

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
  const { error, isAuthenticated, isLoading, loginWithRedirect, logout, user } =
    useAuth0();

  const value = useMemo<AuthContextValue>(
    () => ({
      isConfigured: true,
      isLoading,
      isAuthenticated,
      user,
      error: error?.message,
      login: () =>
        loginWithRedirect({
          appState: {
            returnTo: hostname
          },
        }),
      logoutUser: () =>
        logout({
          logoutParams: {
            returnTo: hostname
          },
        }),
    }),
    [error, hostname, isAuthenticated, isLoading, loginWithRedirect, logout, user],
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
        const nextPath =
          typeof appState?.returnTo === "string"
            ? appState.returnTo
            : hostname;

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
