/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from "@/lib/winston";

/**
 * Models
 */
import User from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from "express";

const deleteCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });
    logger.error("Error while deleting current user account", err);
  }
};

export default deleteCurrentUser;
