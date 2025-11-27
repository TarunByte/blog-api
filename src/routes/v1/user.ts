/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from "express";

/**
 * Middlewares
 */
import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";

/**
 * Controllers
 */
import getCurrentUser from "@/controller/v1/user/get_current_user";
import updateCurrentUser from "@/controller/v1/user/update_current_user";

/**
 * Models
 */
import User from "@/models/user";

const router = Router();

router.get(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  getCurrentUser
);

router.put(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  updateCurrentUser
);

export default router;
