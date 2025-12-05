import z from "zod";

export const blogSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),

  content: z
    .string({ message: "Content is required" })
    .trim()
    .min(1, "Content is required"),

  status: z
    .string()
    .optional()
    .refine((val) => !val || val === "draft" || val === "published", {
      message: "Status must be draft or published",
    }),
});

export const slugSchema = z.object({
  slug: z
    .string({ message: "Slug is required" })
    .min(1, "Slug cannot be empty"),
});
