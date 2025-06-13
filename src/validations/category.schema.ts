import { z } from "zod/v4";

const categorySchema = z.object({
  name: z.string({
    message: "Category name is required"
  }).min(4)
});

export default categorySchema;
