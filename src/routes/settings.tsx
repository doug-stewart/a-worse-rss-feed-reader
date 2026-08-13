import { createFileRoute } from "@tanstack/react-router";
import { SettingsRoute } from "@/features/user/route/settings-route/SettingsRoute";

export const Route = createFileRoute("/settings")({
  component: SettingsRoute,
});
