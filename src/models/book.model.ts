import { db } from "@/config/database";
import { books } from "@/db/schema/schema";
import { eq, desc, and, lt, lte,  getTableColumns } from "drizzle-orm";

export const getAllBooks = async () => {
    const getAllBooks = await db.select().from(books).orderBy(desc(books.createdAt));
    return getAllBooks;
};
