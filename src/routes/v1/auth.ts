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
import logout from "@/controller/v1/auth/logout";

/**
 * Middlewares
 */
import authenticate from "@/middleware/authenticate";

/**
 * Models
 */

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate, logout);

export default router;
