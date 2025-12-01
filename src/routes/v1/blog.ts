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

export default router;
