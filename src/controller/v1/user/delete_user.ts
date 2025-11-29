/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
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
