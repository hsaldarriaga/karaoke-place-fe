import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("routes/_auth.tsx", [
    route("login", "routes/_auth/login.tsx"),
    route("logout", "routes/_auth/logout.tsx"),
  ]),
  layout("routes/_protected.tsx", [
    index("routes/_protected/index.tsx"),
    route("current-events", "routes/_protected/current-events.tsx"),
    route("my-events", "routes/_protected/my-events.tsx"),
    route("my-songs", "routes/_protected/my-songs.tsx"),
  ]),
] satisfies RouteConfig;
