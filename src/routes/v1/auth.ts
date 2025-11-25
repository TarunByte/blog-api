/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { Router } from "express";

/**
 * Controllers
 */
import register from "@/controller/v1/auth/register";
import login from "@/controller/v1/auth/login";
import refreshToken from "@/controller/v1/auth/refresh_token";

/**
 * Middlewares
 */

/**
 * Models
 */

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

export default router;
