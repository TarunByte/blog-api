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
import deleteCurrentUser from "@/controller/v1/user/delete_current_user";
import getAllUser from "@/controller/v1/user/get_all_user";
import getUser from "@/controller/v1/user/get_user";
import deleteUser from "@/controller/v1/user/delete_user";

/**
 * Models
 */

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

router.delete(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  deleteCurrentUser
);

router.get("/", authenticate, authorize(["admin"]), getAllUser);

router.get("/:userId", authenticate, authorize(["admin"]), getUser);
router.delete("/:userId", authenticate, authorize(["admin"]), deleteUser);

export default router;
