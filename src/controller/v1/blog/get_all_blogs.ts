/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import config from "@/config";
import { logger } from "@/lib/winston";
import { paginationSchema } from "@/validators/auth-validators";

/**
 * Models
 */
import Blog from "@/models/blog";
import User from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from "express";

interface QueryType {
  status?: "draft" | "published";
}

const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
  const parsed = paginationSchema.safeParse(req.query);

  if (!parsed.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    logger.warn(parsed.error.issues.map((issues) => issues.message));
    return;
  }

  try {
    const userId = req.userId;
    const limit = parsed.data.limit ?? config.defaultResLimit;
    const offset = parsed.data.offset ?? config.defaultResOffset;

    const user = await User.findById(userId).select("role").lean().exec();
    const query: QueryType = {};

    // Show only the published post to a normal user
    if (user?.role === "user") {
      query.status = "published";
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select("-banner.publicId -__v")
      .populate("author", "-createdAt -updatedAt -__v")
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      blogs,
    });
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error while fetching blogs", err);
  }
};

export default getAllBlogs;
