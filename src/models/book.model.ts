import { db } from "@/config/database";
import { books, categories } from "@/db/schema/schema";
import { desc, eq, like, or, sql } from "drizzle-orm";

export type Book = typeof books.$inferInsert;

export const getAllBooks = async () => {
  const query = db
    .select({
      book_id: books.id,
      title: books.title,
      description: books.description,
      file_path: books.file_path,
      cover_path: books.cover_path,
      author_name: books.author_name,
      category_id: categories.id,
      category_name: categories.name,
      created_at: books.createdAt,
      updated_at: books.updatedAt,
    })
    .from(books)
    .leftJoin(categories, eq(books.id, categories.id))
    .orderBy(desc(books.createdAt))
    .prepare();

  const getAllBooks = await query.execute();

  return getAllBooks;
};

export const getBookById = async (id: number) => {
  const query = db
    .select({
      book_id: books.id,
      title: books.title,
      description: books.description,
      file_path: books.file_path,
      cover_path: books.cover_path,
      author_name: books.author_name,
      category_id: categories.id,
      category_name: categories.name,
      created_at: books.createdAt,
      updated_at: books.updatedAt,
    })
    .from(books)
    .leftJoin(categories, eq(books.id, categories.id))
    .where(eq(books.id, sql.placeholder("id")))
    .prepare();

  const [getBook] = await query.execute({ id });

  return getBook;
};

export const seachBooks = async (search: string) => {
  const query = db
    .select({
      book_id: books.id,
      title: books.title,
      description: books.description,
      file_path: books.file_path,
      cover_path: books.cover_path,
      author_name: books.author_name,
      category_id: categories.id,
      category_name: categories.name,
      created_at: books.createdAt,
      updated_at: books.updatedAt,
    })
    .from(books)
    .leftJoin(categories, eq(books.category_id, categories.id))
    .where(
      or(
        like(books.title, sql.placeholder("search")),
        like(books.author_name, sql.placeholder("search")),
        like(books.description, sql.placeholder("search")),
        like(categories.name, sql.placeholder("search"))
      )
    )
    .orderBy(desc(books.createdAt))
    .prepare();

  const searchBooks = await query.execute({ search });

  return searchBooks;
};

export const createBook = async (bookData: Book) => {
  const query = db.insert(books).values(bookData).prepare();

  const [book] = await query.execute();

  return book;
};

export const updateBook = async (id: number, bookData: Book) => {
  const query = db
    .update(books)
    .set(bookData)
    .where(eq(books.id, sql.placeholder("id")))
    .prepare();

  const [book] = await query.execute({ id });

  return book;
};

export const deleteBook = async (id: number) => {
  const query = db.delete(books).where(eq(books.id, id)).prepare();

  const book = await query.execute({ id });

  return book;
};
