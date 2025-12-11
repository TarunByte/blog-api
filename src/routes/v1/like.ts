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
import authorize from "@/middleware/authorize";
import authenticate from "@/middleware/authenticate";

/**
 * Controllers
 */
import likeBlog from "@/controller/v1/like/like_blog";

const router = Router();

router.post(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  likeBlog
);

export default router;
