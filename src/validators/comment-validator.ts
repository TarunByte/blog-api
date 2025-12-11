import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string({ message: "Content is required" })
    .trim()
    .min(1, "Content is required"),
});
