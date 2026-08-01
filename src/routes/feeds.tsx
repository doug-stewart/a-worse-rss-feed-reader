import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/feeds")({
  validateSearch: z.object({
    category: z.number().array().optional(),
    feed: z.number().array().optional(),
    range: z.enum(["today", "week"]).optional(),
  }),
});
