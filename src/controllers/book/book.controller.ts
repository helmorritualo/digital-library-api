import { getValidatedData } from "@/middlewares/global-validator";
import {
  createBookService,
  deleteBookService,
  getAllBooksService,
  getBookByIdService,
  searchBooksService,
  updateBookService,
} from "@/services/book.service";
import { bookSchema, updateBookSchema } from "@/validations/book.schema";
import { Context } from "hono";
import { z } from "zod/v4";

export const getAllBooks = async (c: Context) => {
  const books = await getAllBooksService();

  return c.json(
    {
      success: true,
      data: books,
    },
    200
  );
};

export const getBookById = async (c: Context) => {
  const book_id = Number(c.req.param("id"));

  const book = await getBookByIdService(book_id);

  return c.json(
    {
      success: true,
      data: book,
    },
    200
  );
};

export const searchBooks = async (c: Context) => {
  const bookSearch = c.req.query("q") ?? "";

  const books = await searchBooksService(bookSearch);

  return c.json(
    {
      success: true,
      data: books,
    },
    200
  );
};

export const createBook = async (c: Context) => {
  const bookData = getValidatedData<z.infer<typeof bookSchema>>(c, "json");

  const book = await createBookService(bookData);

  return c.json(
    {
      success: true,
      message: "Book successfully created",
      data: book,
    },
    201
  );
};

export const updateBook = async (c: Context) => {
  const book_id = Number(c.req.param("id"));

  const updateBookData = getValidatedData<z.infer<typeof updateBookSchema>>(c, "json");

  const book = await updateBookService(book_id, updateBookData);

  return c.json(
    {
      success: true,
      message: "Book successfully updated",
      data: book,
    },
    201
  );
};

export const deleteBook = async (c: Context) => {
  const book_id = Number(c.req.param("id"));

  await deleteBookService(book_id);

  return c.json(
    {
      success: true,
      message: "Book successfully deleted",
    },
    200
  );
};
