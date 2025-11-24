import z from "zod";

export const registerUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email must be no more than 100 characters." }),

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
