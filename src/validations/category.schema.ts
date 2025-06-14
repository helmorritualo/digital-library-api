import { z } from "zod/v4";

export const categorySchema = z.object({
  name: z.string({
    message: "Category name is required"
  }).min(4)
});
