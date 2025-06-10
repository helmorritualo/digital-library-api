import { z } from "zod/v4";

export const bookSchema = z.object({
  title: z
    .string({
      message: "Title is required",
    })
    .min(1),
  description: z
    .string({
      message: "Description is required",
    })
    .min(6),
  file_path: z.string({
    message: "File path is required",
  }),
  cover_path: z.string({
    message: "Cover path is required",
  }),
  author_name: z.string({
    message: "Author is required",
  }),
});

export const updateBookSchema = bookSchema.partial().refine(
  (data) => {
    return Object.values(data).some((value) => value !== undefined);
  },
  {
    message: "Atleast onefield is required to update ",
  }
);
