/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import config from "@/config";
import { genUsername } from "@/utils";

/**
 * Models
 */
import User from "@/models/user";
import Token from "@/models/token";

/**
 * Types
 */
import type { Request, Response } from "express";
import { registerUserSchema } from "@/validators/auth-validators";
// import type { IUser } from "@/models/user";

// type UserData = Pick<IUser, "email" | "password" | "role">;

const register = async (req: Request, res: Response): Promise<void> => {
  const parsed = registerUserSchema.safeParse(req.body);

  if (!parsed.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    logger.warn(parsed.error.issues.map((issues) => issues.message));
    return;
  }

  const { email, password, role } = parsed.data;

  const userExists = await User.exists({ email });
  if (userExists) {
    res.status(409).json({
      message: "User already exists with this email",
    });
    logger.warn(`User with ${email} is already exists`);
    return;
  }

  if (role === "admin" && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    res.status(403).json({
      code: "AuthorizationError",
      message: "You cannot register as an admin",
    });

    logger.warn(
      `User with email ${email} tried to register as an admin but it is not in the whitelist`
    );
    return;
  }

  try {
    const username = genUsername();
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    // Generate access token and refresh token for new user
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in db
    await Token.create({ token: refreshToken, userId: newUser._id });
    logger.info("Refresh token created for user", {
      userId: newUser._id,
      token: refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });

    logger.info("User registred successfully", {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error during user registration", err);
  }
};

export default register;
