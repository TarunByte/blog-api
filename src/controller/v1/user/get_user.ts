/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import config from "@/config";
import { logger } from "@/lib/winston";
import { userIdParamSchema } from "@/validators/auth-validators";

/**
 * Models
 */
import User from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from "express";

const getUser = async (req: Request, res: Response): Promise<void> => {
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
    const user = await User.findById(userId).select("-__v").exec();

    if (!user) {
      res.status(404).json({
        code: "NotFound",
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error while getting a user", err);
  }
};

export default getUser;
