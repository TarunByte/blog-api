/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

/**
 * Custom modules
 */
import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";
import { refreshTokenSchema } from "@/validators/auth-validators";
import { logger } from "@/lib/winston";

/**
 * Modles
 */
import Token from "@/models/token";

/**
 * Types
 */
import type { Request, Response } from "express";
import { Types } from "mongoose";

const refreshToken = async (req: Request, res: Response) => {
  const parsed = refreshTokenSchema.safeParse(req.cookies);

  try {
    if (!parsed.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.issues,
      });
      return;
    }

    const { refreshToken } = parsed.data;

    const tokenExists = await Token.exists({ token: refreshToken });

    if (!tokenExists) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Invalid refresh token",
      });
      return;
    }

    // Verify refresh token
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const accessToken = generateAccessToken(jwtPayload.userId);

    res.status(200).json({
      accessToken,
    });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Refresh token expired, pleaser login again",
      });
      return;
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        code: "AuthenticationError",
        message: "Invalid refresh token",
      });
      return;
    }
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });
  }
};

export default refreshToken;
