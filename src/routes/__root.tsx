import { createRootRoute } from "@tanstack/react-router";
import { IndexRoute } from "@/components/index-route/IndexRoute";

export const Route = createRootRoute({
  component: IndexRoute,
});
