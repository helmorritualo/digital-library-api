import { z } from "zod/v4";

const userSchema = z.object({
  name: z
    .string({
      message: "Name is required",
    })
    .min(1),
  email: z.email({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email format",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  contact_number: z.string().min(6).max(11, {
    message: "Contact number must be 11 digits",
  }),
  gender: z.enum(["male", "female", "other"]),
  address: z.string({
    message: "Address is required",
  }),
  is_active: z.boolean()
});

export default userSchema;
