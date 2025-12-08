/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from "express";
import multer from "multer";
import { body } from "express-validator";

/**
 * Middlewares
 */
import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import uploadBlogBanner from "@/middleware/uploadBlogBanner";

/**
 * Controllers
 */
import createBlog from "@/controller/v1/blog/create_blog";
import getAllBlogs from "@/controller/v1/blog/get_all_blogs";
import getBlogsByUser from "@/controller/v1/blog/get_blogs_by_user";
import getBlogBySlug from "@/controller/v1/blog/get_blog_by_slug";
import updateBlog from "@/controller/v1/blog/update_blog";

/**
 * Models
 */
const upload = multer();

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  // body("baanner_image").notEmpty().withMessage("Banner image is required"),
  upload.single("banner_image"),
  uploadBlogBanner("post"),
  createBlog
);

router.get("/", authenticate, authorize(["admin", "user"]), getAllBlogs);

router.get(
  "/user/:userId",
  authenticate,
  authorize(["admin", "user"]),
  getBlogsByUser
);

router.get("/:slug", authenticate, authorize(["admin", "user"]), getBlogBySlug);

router.put(
  "/:blogId",
  authenticate,
  authorize(["admin"]),
  upload.single("banner_image"),
  uploadBlogBanner("put"),
  updateBlog
);

export default router;
