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
import User from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from "express";

const getAllUser = async (req: Request, res: Response): Promise<void> => {
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
    const limit = parsed.data.limit ?? config.defaultResLimit;
    const offset = parsed.data.offset ?? config.defaultResOffset;
    const total = await User.countDocuments();

    const users = await User.find()
      .select("-__v")
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      users,
    });
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error while getting all users", err);
  }
};

export default getAllUser;
