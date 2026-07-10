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
import Comment from "@/models/comment";
/**
 * Types
 */
import type { Request, Response } from "express";

const getAllComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 5;

    const allComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    const total = await Comment.countDocuments();

    res.status(200).json({
      total,
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

export default getAllComments;
