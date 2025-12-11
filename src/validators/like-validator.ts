import { z } from "zod";

export const userIdSchema = z.object({
  userId: z
    .string({ message: "userId is required" })
    .min(1, "userId cannot be empty")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});
