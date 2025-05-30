import { users } from "@/db/schema/schema";
import { db } from "@/config/database";
import { eq, desc, getTableColumns } from "drizzle-orm";

type User = typeof users.$inferInsert;
type UserWithoutPassword = Omit<User, "password">;

export const getAllUsers = async (): Promise<UserWithoutPassword[]> => {
  const { password, ...usersWithoutPassword } = getTableColumns(users);
  const getAllUsers = await db
    .select({ ...usersWithoutPassword })
    .from(users)
    .orderBy(desc(users.createdAt));

  return getAllUsers;
};

export const updateUser = async (id: number, userData: User) => {
  const { password, ...updateData } = userData;

  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id));

  return updatedUser;
};

export const archiveUser = async (id: number) => {
  const [archivedUser] = await db
    .update(users)
    .set({ isActive: false })
    .where(eq(users.id, id));

  return archivedUser;
};

export const unarchieveUser = async (id: number) => {
  const [activatedUser] = await db
    .update(users)
    .set({ isActive: true })
    .where(eq(users.id, id));

  return activatedUser;
};

export const deleteUser = async (id: number) => {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, id));

  return deletedUser;
};