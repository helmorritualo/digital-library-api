import { db } from "@/config/database";
import { books, categories } from "@/db/schema/schema";
import { desc, eq, like, sql } from "drizzle-orm";

export type Category = typeof categories.$inferInsert;

export const getAllCategories = async () => {
  const query = db
    .select({
      category_id: categories.id,
      category_name: categories.name,
    })
    .from(categories)
    .orderBy(desc(categories.createdAt))
    .prepare();

  const getAllCategories = await query.execute();

  return getAllCategories;
};

export const getCategoryById = async (id: number) => {
  const query = db
    .select({
      category_id: categories.id,
      category_name: categories.name,
    })
    .from(categories)
    .where(eq(categories.id, sql.placeholder("id")))
    .prepare();

  const [getBookById] = await query.execute({ id });

  return getBookById;
};

export const getBooksByCategory = async (categoryName: string) => {
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
    .where(like(categories.name, sql.placeholder("categoryName")))
    .orderBy(desc(books.createdAt))
    .prepare();

  const getBooksByCategory = await query.execute({ categoryName });

  return getBooksByCategory;
};

export const createCategory = async (categoryData: Category) => {
  const query = db.insert(categories).values(categoryData).prepare();
  const createCategory = await query.execute();

  return createCategory;
};

export const updateCategory = async (id: number, categoryData: Category) => {
  const query = db
    .update(categories)
    .set(categoryData)
    .where(eq(categories.id, sql.placeholder("id")))
    .prepare();
  const [updateCategory] = await query.execute({ id });

  return updateCategory;
};

export const deleteCategory = async (id: number) => {
  const query = db
    .delete(categories)
    .where(eq(categories.id, sql.placeholder("id")))
    .prepare();

  const deleteBook = await query.execute({ id });

  return deleteBook;
};
