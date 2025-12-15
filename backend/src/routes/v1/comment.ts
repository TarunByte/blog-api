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
import commentBlog from "@/controller/v1/comment/comment_blog";
import getCommentsByBlog from "@/controller/v1/comment/get_comments_by_blog";
import deleteComment from "@/controller/v1/comment/delete_comment";

const router = Router();

router.post(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  commentBlog
);

router.get(
  "/blog/:blogId",
  authenticate,
  authorize(["admin", "user"]),
  getCommentsByBlog
);

router.delete(
  "/:commentId",
  authenticate,
  authorize(["admin", "user"]),
  deleteComment
);

export default router;
