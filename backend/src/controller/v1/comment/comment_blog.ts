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
import { blogIdSchema } from "@/validators/blog-validators";
import { commentSchema } from "@/validators/comment-validator";

/**
 * Models
 */
import Blog from "@/models/blog";
import Comment from "@/models/comment";

/**
 * Types
 */
import type { Request, Response } from "express";

/**
 * Purify the comment content
 */
const window = new JSDOM("").window;
const purify = DOMPurify(window);

const commentBlog = async (req: Request, res: Response): Promise<void> => {
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

  const parsedContent = commentSchema.safeParse(req.body);

  if (!parsedContent.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsedContent.error.issues,
    });
    logger.warn(parsedContent.error.issues.map((issue) => issue.message));
    return;
  }

  const { content } = parsedContent.data;

  const userId = req.userId;

  try {
    const blog = await Blog.findById(blogId).select("_id commentsCount").exec();

    if (!blog) {
      res.status(404).json({
        code: "NotFound",
        message: "Blog not found",
      });
      return;
    }

    const cleanContent = purify.sanitize(content);

    const newComment = await Comment.create({
      blogId,
      userId,
      content: cleanContent,
    });

    logger.info("New comment created:", newComment);

    blog.commentsCount++;
    await blog.save();

    logger.info("Blog comments count updated:", {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.status(201).json({
      comment: newComment,
    });
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error during commenting in blog", err);
  }
};

export default commentBlog;
