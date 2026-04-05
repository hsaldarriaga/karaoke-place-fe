import axios from "axios";

type TokenGetter = () => Promise<string>;

let getToken: TokenGetter | null = null;

/**
 * Called from AuthContextBridge to provide the Auth0 getAccessTokenSilently
 * function so the axios interceptor can attach Bearer tokens automatically.
 */
export function setTokenGetter(getter: TokenGetter | null) {
  getToken = getter;
}

// Attach an async request interceptor to the default axios instance.
// Every outgoing request will receive an Authorization header when a
// token getter has been registered (i.e. the user is authenticated).
axios.interceptors.request.use(async (config) => {
  if (getToken) {
    try {
      const token = await getToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Token retrieval failed (e.g. session expired) – let the request
      // proceed without the header so the server can return a 401.
    }
  }
  return config;
});
