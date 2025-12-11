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

const likeBlog = async (req: Request, res: Response): Promise<void> => {
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
    const blog = await Blog.findById(blogId).select("likesCount").exec();

    if (!blog) {
      res.status(404).json({
        code: "NotFound",
        message: "Blog not found",
      });
      return;
    }

    const existingLike = await Like.findOne({ blogId, userId }).lean().exec();
    if (existingLike) {
      res.status(400).json({
        code: "BadRequest",
        message: "You already liked this blog",
      });
      return;
    }

    await Like.create({ blogId, userId });

    blog.likesCount++;
    await blog.save();

    logger.info("Blog liked successfully:", {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    res.status(200).json({
      likesCount: blog.likesCount,
    });
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error while liking blog", err);
  }
};

export default likeBlog;
