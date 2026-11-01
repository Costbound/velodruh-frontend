import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("wizard", "routes/wizard.tsx"),
  route("bikes", "routes/bikes.tsx"),
  route("bikes/:slug", "routes/bike-detail.tsx"),
] satisfies RouteConfig;
