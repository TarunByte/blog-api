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
import { userIdParamSchema } from "@/validators/auth-validators";

/**
 * Models
 */
import User from "@/models/user";
import Blog from "@/models/blog";

/**
 * Types
 */
import type { Request, Response } from "express";

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const parsed = userIdParamSchema.safeParse(req.params);

  if (!parsed.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    logger.warn(parsed.error.issues.map((issues) => issues.message));
    return;
  }

  const { userId } = parsed.data;

  try {
    const blogs = await Blog.find({ author: userId })
      .select("banner.publicId")
      .lean()
      .exec();

    const publicIds = blogs.map(({ banner }) => banner.publicId);
    await cloudinary.api.delete_resources(publicIds);

    logger.info("Multiple blog banners deleted from Cloudinary", { publicIds });

    await Blog.deleteMany({ author: userId });
    logger.info("Multiple blogs deleted", {
      userId,
      blogs,
    });

    await User.deleteOne({ _id: userId });
    logger.info("A user account has been deleted", {
      userId,
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error while deleting current user account", err);
  }
};

export default deleteUser;
