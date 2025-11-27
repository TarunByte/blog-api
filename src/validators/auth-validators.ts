import User from "@/models/user";
import z, { email } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address." })
  .max(100, { message: "Email must be no more than 100 characters." });

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long." })
  .max(100, { message: "Password must be no more than 100 characters." });

export const registerUserSchema = z.object({
  email: emailSchema,

  password: passwordSchema,

  role: z
    .string({ message: "Role must be a string" })
    .refine((val) => val === "admin" || val === "user", {
      message: "Role must be either admin or user",
    })
    .optional(),
});

export const loginUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token required")
    .refine((val) => val.split(".").length === 3, {
      message: "Invalid refresh token format",
    }),
});

const socialLinkSchema = z
  .string()
  .url({ message: "Invalid URL" })
  .max(100, { message: "Url must be less than 100 characters" })
  .optional();

export const updateUserSchema = z.object({
  username: z
    .string()
    .trim()
    .max(20, { message: "Username must be less than 20 characters" })
    .refine(
      async (value) => {
        const userExists = await User.exists({ username: value });
        return !userExists;
      },
      {
        message: "This username is already in use",
      }
    )
    .optional(),

  email: emailSchema.optional(),
  password: passwordSchema.optional(),

  first_name: z
    .string()
    .max(20, { message: "First name must be less than 20 characters" })
    .optional(),

  last_name: z
    .string()
    .max(20, { message: "Last name must be less than 20 characters" })
    .optional(),

  website: socialLinkSchema,
  facebook: socialLinkSchema,
  instagram: socialLinkSchema,
  linkedin: socialLinkSchema,
  x: socialLinkSchema,
  youtube: socialLinkSchema,
});
