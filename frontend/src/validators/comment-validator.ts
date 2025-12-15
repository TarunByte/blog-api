import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string({ message: "Content is required" })
    .trim()
    .min(1, "Content is required"),
});

export const commentIdSchema = z.object({
  commentId: z
    .string({ message: "commentId is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid comment ID"),
});
