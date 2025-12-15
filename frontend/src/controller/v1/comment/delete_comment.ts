/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from "@/lib/winston";
import { commentIdSchema } from "@/validators/comment-validator";

/**
 * Models
 */
import Blog from "@/models/blog";
import User from "@/models/user";
import Comment from "@/models/comment";

/**
 * Types
 */
import type { Request, Response } from "express";

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const parsed = commentIdSchema.safeParse(req.params);

  if (!parsed.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    logger.warn(parsed.error.issues.map((issue) => issue.message));
    return;
  }

  const currentUserId = req.userId;
  const { commentId } = parsed.data;

  try {
    const comment = await Comment.findById(commentId)
      .select("userId blogId")
      .lean()
      .exec();
    const user = await User.findById(currentUserId)
      .select("role")
      .lean()
      .exec();

    if (!comment) {
      res.status(404).json({
        code: "NotFound",
        message: "Comment not found",
      });
      return;
    }

    const blog = await Blog.findById(comment.blogId)
      .select("commentsCount")
      .exec();

    if (!blog) {
      res.status(404).json({
        code: "NotFound",
        message: "Blog not found",
      });
      return;
    }

    if (comment.userId !== currentUserId && user?.role !== "admin") {
      res.status(403).json({
        code: "AuthorizationError",
        message: "Access denied. insufficient permission",
      });

      logger.warn("A user tried to delete a comment without permissions", {
        userId: currentUserId,
        comment,
      });
      return;
    }

    await Comment.deleteOne({ _id: commentId });

    logger.info("Comment deleted successfully", {
      commentId,
    });

    blog.commentsCount--;
    await blog.save();

    logger.info("Blog comments count updated", {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error while deleting comments", err);
  }
};

export default deleteComment;
