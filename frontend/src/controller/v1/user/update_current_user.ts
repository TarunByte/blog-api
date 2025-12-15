/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

/**
 * Custom modules
 */
import { logger } from "@/lib/winston";
import { updateUserSchema } from "@/validators/auth-validators";

/**
 * Models
 */
import User from "@/models/user";

/**
 * Types
 */
import type { Request, Response } from "express";

const updateCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  const parsed = await updateUserSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    // validation fail
    res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.issues,
    });
    logger.warn(parsed.error.issues.map((issues) => issues.message));
    return;
  }

  const {
    username,
    email,
    password,
    first_name,
    last_name,
    website,
    facebook,
    instagram,
    linkedin,
    x,
    youtube,
  } = parsed.data;

  try {
    const user = await User.findById(userId).select("+password -__v").exec();

    if (!user) {
      res.status(404).json({
        code: "NotFound",
        message: "User not found",
      });
      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (first_name) user.firstName = first_name;
    if (last_name) user.lastName = last_name;
    if (!user.socialLinks) {
      user.socialLinks = {};
    }
    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (instagram) user.socialLinks.instagram = instagram;
    if (linkedin) user.socialLinks.linkedin = linkedin;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;

    await user.save();

    logger.info("User update successfully", user);

    res.status(200).json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      code: "ServerError",
      message: "Internal server error",
      error: err,
    });

    logger.error("Error while update current user", err);
  }
};

export default updateCurrentUser;
