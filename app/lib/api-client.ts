import axios from "axios";

type TokenGetter = () => Promise<string>;

const LOGIN_PATHS = new Set(["/login", "/logout"]);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (apiBaseUrl) {
  axios.defaults.baseURL = apiBaseUrl;
}

let getToken: TokenGetter | null = null;
let isRedirectingToLogin = false;

function redirectToLogin() {
  if (typeof window === "undefined" || isRedirectingToLogin) {
    return;
  }

  const { hash, pathname, search } = window.location;

  if (LOGIN_PATHS.has(pathname)) {
    return;
  }

  isRedirectingToLogin = true;

  const returnTo = `${pathname}${search}${hash}` || "/";
  window.location.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
}

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
    } catch (error) {
      console.error("Failed to get access token, redirecting to login", error);
      redirectToLogin();
    }
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);
