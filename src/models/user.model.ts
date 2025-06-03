import { users } from "@/db/schema/schema";
import { db } from "@/config/database";
import { eq, desc, getTableColumns, sql } from "drizzle-orm";

type User = typeof users.$inferInsert;
type UserWithoutPassword = Omit<User, "password">;

export const getAllUsers = async (): Promise<UserWithoutPassword[]> => {
  const { password, ...usersWithoutPassword } = getTableColumns(users);
  const query = db
    .select({ ...usersWithoutPassword })
    .from(users)
    .orderBy(desc(users.createdAt)).prepare()

 const getAllBooks = await query.execute()

 return getAllBooks
};

export const updateUser = async (id: number, userData: User) => {
  const { password, ...updateData } = userData;
  const query = db
    .update(users)
    .set(updateData)
    .where(eq(users.id, sql.placeholder('id'))).prepare()

  const [user] = await query.execute({ id })

  return user
};

export const archiveUser = async (id: number) => {
  const query = await db
    .update(users)
    .set({ isActive: false })
    .where(eq(users.id, sql.placeholder('id'))).prepare()

  const [user] = await query.execute({ id })

  return user
};

export const unarchieveUser = async (id: number) => {
  const query = db
    .update(users)
    .set({ isActive: true })
    .where(eq(users.id, sql.placeholder('id'))).prepare()

  const [user] = await query.execute({ id })

  return user
};

export const deleteUser = async (id: number) => {
  const query = db
    .delete(users)
    .where(eq(users.id, sql.placeholder('id'))).prepare()

  const user = await query.execute({ id })

  return user
};
