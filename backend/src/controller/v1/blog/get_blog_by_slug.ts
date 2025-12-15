/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from "@/lib/winston";
import { slugSchema } from "@/validators/blog-validators";
/**
 * Models
 */
import Blog from "@/models/blog";
import User from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from "express";

const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  const parsed = slugSchema.safeParse(req.params);

  if (!parsed.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    logger.warn(parsed.error.issues.map((issues) => issues.message));
    return;
  }

  const { slug } = parsed.data;

  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("role").lean().exec();
    const blog = await Blog.findOne({ slug })
      .select("-banner.publicId -__v")
      .populate("author", "-createdAt -updatedAt -__v")
      .lean()
      .exec();

    if (!blog) {
      res.status(404).json({
        code: "NotFound",
        message: "Blog not found",
      });
      return;
    }

    if (user?.role === "user" && blog.status === "draft") {
      res.status(403).json({
        code: "AuthorizationError",
        message: "Access denied, insufficient permissions",
      });

      logger.warn("A user tried to access a draft blog", {
        userId,
        blog,
      });
      return;
    }

    res.status(200).json({
      blog,
    });
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error while fetching blog by slug", err);
  }
};

export default getBlogBySlug;
