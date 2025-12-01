/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

/**
 * Custom modules
 */
import { logger } from "@/lib/winston";
import { blogSchema } from "@/validators/blog-validators";

/**
 * Models
 */
import Blog, { IBlog } from "@/models/blog";

/**
 * Types
 */
import type { Request, Response } from "express";

type BlogData = Pick<IBlog, "banner">;

/**
 * Purify the blog content
 */
const window = new JSDOM("").window;
const purify = DOMPurify(window);

const createBlog = async (req: Request, res: Response): Promise<void> => {
  const { banner } = req.body as BlogData;
  const parsed = blogSchema.safeParse(req.body);

  if (!parsed.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    logger.warn(parsed.error.issues.map((issue) => issue.message));
    return;
  }
  try {
    const { title, content, status } = parsed.data;
    const userId = req.userId;

    const cleanContent = purify.sanitize(content);

    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId,
    });

    logger.info("New blog created", newBlog);

    res.status(201).json({
      blog: newBlog,
    });
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error during blog creation", err);
  }
};

export default createBlog;
