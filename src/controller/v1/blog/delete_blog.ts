/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { v2 as cloudinary } from "cloudinary";

/**
 * Custom modules
 */
import { logger } from "@/lib/winston";
import { blogIdSchema } from "@/validators/blog-validators";

/**
 * Models
 */
import Blog from "@/models/blog";
import User from "@/models/user";
/**
 * Types
 */
import type { Request, Response } from "express";

const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  const parsed = blogIdSchema.safeParse(req.params);

  if (!parsed.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    logger.warn(parsed.error.issues.map((issue) => issue.message));
    return;
  }

  const { blogId } = parsed.data;

  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("role").lean().exec();
    const blog = await Blog.findById(blogId)
      .select("author banner.publicId")
      .lean()
      .exec();

    if (!blog) {
      res.status(404).json({
        code: "NotFound",
        message: "Blog not found",
      });
      return;
    }

    if (blog.author !== userId && user?.role !== "admin") {
      res.status(403).json({
        code: "AuthorizationError",
        message: "Access denied, insufficient permissions",
      });

      logger.warn("A user tried to delete a blog without permissions", {
        userId,
      });
      return;
    }

    await cloudinary.uploader.destroy(blog.banner.publicId);
    logger.info("Blog banner deleted from Cloudinary", {
      publicId: blog.banner.publicId,
    });

    await Blog.deleteOne({ _id: blogId });
    logger.info("Blog deleted successfully", { blogId });

    res.status(204);
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error during blog deletion", err);
  }
};

export default deleteBlog;
