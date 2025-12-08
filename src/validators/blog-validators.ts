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
    .enum(["draft", "published"], {
      error: "Status must be draft or published",
    })
    .optional(),
});

export const updateBlogSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" })
    .optional(),

  content: z
    .string()
    .trim()
    .min(1, { message: "Content cannot be empty" })
    .optional(),

  status: z
    .enum(["draft", "published"], {
      error: "Status must be draft or published",
    })
    .optional(),
});

export const slugSchema = z.object({
  slug: z
    .string({ message: "Slug is required" })
    .min(1, "Slug cannot be empty"),
});

export const blogIdSchema = z.object({
  blogId: z
    .string({ message: "blogId is required" })
    .min(1, "blogId cannot be empty")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid blog ID"),
});
