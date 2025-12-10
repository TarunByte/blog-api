/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from "@/lib/winston";
import uploadToCloudinary from "@/lib/cloudinary";
import { blogIdSchema } from "@/validators/blog-validators";

/**
 * Models
 */
import Blog from "@/models/blog";

/**
 * Types
 */
import type { Request, Response, NextFunction } from "express";
import type { UploadApiErrorResponse } from "cloudinary";

/**
 * Constants
 */
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const uploadBlogBanner = (method: "post" | "put") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === "put" && !req.file) {
      next();
      return;
    }

    if (!req.file) {
      res.status(400).json({
        code: "ValidationError",
        message: "Blog banner is required",
      });
      return;
    }

    if (req.file.size > MAX_FILE_SIZE) {
      res.status(413).json({
        code: "ValidationError",
        message: "File size must be less than 2MB",
      });
      return;
    }

    let parsedBlogId: any;

    if (method === "post") {
      parsedBlogId = req.params;
    }

    if (method === "put") {
      const parsed = blogIdSchema.safeParse(req.params);

      if (!parsed.success) {
        // validation fail
        res.status(400).json({
          message: "Validation failed",
          errors: parsed.error.issues,
        });
        logger.warn(parsed.error.issues.map((issues) => issues.message));
        return;
      }

      parsedBlogId = parsed.data;
    }

    const { blogId } = parsedBlogId;

    try {
      const blog = await Blog.findById(blogId).select("banner.publicId").exec();

      const data = await uploadToCloudinary(
        req.file.buffer,
        blog?.banner.publicId.replace("blog-api/", "")
      );

      if (!data) {
        res.status(500).json({
          code: "ServerError",
          message: "Internal server error",
        });

        logger.error("Error while uploading blog banner to cloudinary", {
          blogId,
          publicId: blog?.banner.publicId,
        });
        return;
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      logger.info("Blog banner uploaded to Cloudinary", {
        blogId,
        banner: newBanner,
      });

      req.body.banner = newBanner;

      next();
    } catch (err: UploadApiErrorResponse | any) {
      res.status(err.http_code).json({
        code: err.http_code < 500 ? "ValidationError" : err.name,
        message: err.message,
      });

      logger.error("Error while uploading blog banner to Cloudinary", err);
    }
  };
};

export default uploadBlogBanner;
