import Axios, { type AxiosRequestConfig, AxiosError } from "axios";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

const LOGIN_PATHS = new Set(["/login", "/logout"]);

export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  paramsSerializer: {
    indexes: true,
  },
});

type TokenGetter = () => Promise<string>;

export const useConfigureAxios = (getToken: TokenGetter | null) => {
  const navigate = useNavigate();
  const redirectToLogin = useCallback(() => {
    const { hash, pathname, search } = window.location;

    if (LOGIN_PATHS.has(pathname)) {
      return;
    }

    const returnTo = `${pathname}${search}${hash}` || "/";
    navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, {
      replace: true,
    });
  }, [navigate]);

  useEffect(() => {
    if (!getToken) return;
    // Attach an async request interceptor to the default axios instance.
    // Every outgoing request will receive an Authorization header when a
    // token getter has been registered (i.e. the user is authenticated).
    const requestInterceptorId = axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error(
            "Failed to get access token, redirecting to login",
            error,
          );
          redirectToLogin();
        }

        return config;
      },
    );

    const responseInterceptorId = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (Axios.isAxiosError(error) && error.response?.status === 401) {
          redirectToLogin();
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptorId);
      axiosInstance.interceptors.response.eject(responseInterceptorId);
    };
  }, [getToken, redirectToLogin]);
};

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const promise = axiosInstance({
    ...config,
    ...options,
  }).then(({ data }) => data);
  return promise;
};
// Override the return error type for react-query and swr
export type ErrorType<Error> = AxiosError<Error>;
// Standard body type
export type BodyType<BodyData> = BodyData;
