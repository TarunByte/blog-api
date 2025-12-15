/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from "@/lib/winston";
import { blogIdSchema } from "@/validators/blog-validators";

/**
 * Models
 */
import Blog from "@/models/blog";
import Comment from "@/models/comment";

/**
 * Types
 */
import type { Request, Response } from "express";

const getCommentsByBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsedBlogId = blogIdSchema.safeParse(req.params);

  if (!parsedBlogId.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsedBlogId.error.issues,
    });
    logger.warn(parsedBlogId.error.issues.map((issue) => issue.message));
    return;
  }

  const { blogId } = parsedBlogId.data;

  try {
    const blog = await Blog.findById(blogId).select("_id").lean().exec();

    if (!blog) {
      res.status(404).json({
        code: "NotFound",
        message: "Blog not found",
      });
      return;
    }

    const allComments = await Comment.find({ blogId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      comments: allComments,
    });
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error retrieving comments", err);
  }
};

export default getCommentsByBlog;
