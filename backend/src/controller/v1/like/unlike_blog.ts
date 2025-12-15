/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from "@/lib/winston";
import { blogIdSchema } from "@/validators/blog-validators";
import { userIdSchema } from "@/validators/like-validator";

/**
 * Models
 */
import Blog from "@/models/blog";
import Like from "@/models/like";

/**
 * Types
 */
import type { Request, Response } from "express";

const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
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

  const parsedUserId = userIdSchema.safeParse(req.body);

  if (!parsedUserId.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsedUserId.error.issues,
    });
    logger.warn(parsedUserId.error.issues.map((issue) => issue.message));
    return;
  }

  const { userId } = parsedUserId.data;

  try {
    const existingLike = await Like.findOne({ userId, blogId }).lean().exec();

    if (!existingLike) {
      res.status(404).json({
        code: "NotFound",
        message: "Like not found",
      });
      return;
    }

    await Like.deleteOne({ _id: existingLike._id });

    const blog = await Blog.findById(blogId).select("likesCount").exec();

    if (!blog) {
      res.status(404).json({
        code: "NotFound",
        message: "Blog not found",
      });
      return;
    }

    blog.likesCount--;
    await blog.save();

    logger.info("Blog unliked successfully:", {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error while unliking blog", err);
  }
};

export default unlikeBlog;
