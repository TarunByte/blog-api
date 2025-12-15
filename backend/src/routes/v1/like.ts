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
import unlikeBlog from "@/controller/v1/like/unlike_blog";

const router = Router();

router.post(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  likeBlog
);

router.delete(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  unlikeBlog
);

export default router;
