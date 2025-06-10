import { Hono } from "hono";
import { getAllBooks, getBookById, searchBooks, createBook, updateBook, deleteBook } from "./book.controller";
import { authMiddleware, requireAdmin } from "@/middlewares/authentication";
import { bookSchema, updateBookSchema } from "@/validations/book.schema";
import { validateJson } from "@/middlewares/global-validator";

const bookRouter = new Hono();

bookRouter.get("/books", authMiddleware, getAllBooks);
bookRouter.get("/books/:id", authMiddleware, getBookById);
bookRouter.get("/books/category", authMiddleware, searchBooks);
bookRouter.post("/books", authMiddleware, validateJson(bookSchema), createBook);
bookRouter.put("/books/:id", authMiddleware, validateJson(updateBookSchema), updateBook);
bookRouter.delete("books/:id", authMiddleware, requireAdmin, deleteBook);

export default bookRouter;
