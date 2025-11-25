import z, { email } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address." })
  .max(100, { message: "Email must be no more than 100 characters." });

export const registerUserSchema = z.object({
  email: emailSchema,

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password must be no more than 100 characters." }),

  role: z
    .string({ message: "Role must be a string" })
    .refine((val) => val === "admin" || val === "user", {
      message: "Role must be either admin or user",
    })
    .optional(),
});

export const loginUserSchema = z.object({
  email: emailSchema,

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password must be no more than 100 characters." }),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, "Refresh token required")
    .refine((val) => val.split(".").length === 3, {
      message: "Invalid refresh token format",
    }),
});
