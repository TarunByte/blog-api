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
import { loginUserSchema } from "@/validators/auth-validators";

/**
 * Modules
 */
import User from "@/models/user";
import Token from "@/models/token";
import bcrypt from "bcrypt";

/**
 * Types
 */
import type { Request, Response } from "express";
import type { IUser } from "@/models/user";

const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginUserSchema.safeParse(req.body);

  if (!parsed.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    logger.warn(parsed.error.issues.map((issues) => issues.message));
    return;
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email })
    .select("username email password role")
    .lean()
    .exec();

  if (!user) {
    res.status(404).json({
      code: "NotFound",
      message: "User not found",
    });
    return;
  }

  //password match
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(401).json({
      message: "Invalid email or password",
    });
    return;
  }

  // Generate access token and refresh token for new user
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in db
  await Token.create({ token: refreshToken, userId: user._id });
  logger.info("Refresh token created for user", {
    userId: user._id,
    token: refreshToken,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(201).json({
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken,
  });

  logger.info("User login successfully", user);
};

export default login;
