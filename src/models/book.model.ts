import { db } from "@/config/database";
import { books, categories } from "@/db/schema/schema";
import { eq, desc } from "drizzle-orm";

type Book = typeof books.$inferInsert;

export const getAllBooks = async () => {
  const getAllBooks = await db.select({
    book_id: books.id,
    title: books.title,
    description: books.description,
    file_path: books.file_path,
    cover_path: books.cover_path,
    author_name: books.author_name,
    category_id: categories.id,
    category_name: categories.name,
    created_at: books.createdAt,
    updated_at: books.updatedAt
  }).from(books)
  .leftJoin(categories, eq(books.id, categories.id))
  .orderBy(desc(books.createdAt));

  return getAllBooks;
};

export const getBookById = async (id: number) => {
  const [getBook] = await db.select({
    book_id: books.id,
    title: books.title,
    description: books.description,
    file_path: books.file_path,
    cover_path: books.cover_path,
    author_name: books.author_name,
    category_id: categories.id,
    category_name: categories.name,
    created_at: books.createdAt,
    updated_at: books.updatedAt
  }).from(books)
  .leftJoin(categories, eq(books.id, categories.id))
  .where(eq(books.id, id));

  return getBook;
};

export const createBook = async (bookData: Book) => {
  const [book] = await db.insert(books).values(bookData);

  return book;
};

export const updateBook =  async (id: number, bookData: Book) => {
  const [book] = await db.update(books).set(bookData).where(eq(books.id, id));

  return book;
};

export const deleteBooks = async (id: number) => {
  const [book] = await db.delete(books).where(eq(books.id, id));

  return book;
};
