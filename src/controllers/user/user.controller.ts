import { getValidatedData } from "@/middlewares/global-validator";
import {
  archiveUserService,
  deleteUserService,
  getAllUserService,
  getUserProfileService,
  unarchiveUserService,
  updateUserService,
} from "@/services/user.service";
import userSchema from "@/validations/user.schema";
import { Context } from "hono";
import { z } from "zod/v4";

export const getAllUsers = async (c: Context) => {
  const users = await getAllUserService();

  return c.json({
    success: true,
    data: users,
  }, 200);
};

export const getUserProfile = async (c: Context) => {
  const user_id = c.get("user_id");
  const user = await getUserProfileService(user_id);

  return c.json({
    success: true,
    data: user,
  }, 200);
};

export const updateUser = async (c: Context) => {
  const user_id = c.get("user_id");
  const userData = getValidatedData<z.infer<typeof userSchema>>(c, "json");

  const updatedUserData = await updateUserService(user_id, userData);

  return c.json({
    success: true,
    message: "Update profile successfully",
    data: updatedUserData
  }, 201)
};

export const archiveUser = async (c: Context) => {
  const user_id = Number(c.req.param("id"));

  await archiveUserService(user_id);

  return c.json({
    success: true,
    message: "Arhieve user successfully"
  }, 200)
};

export const unArchieveUser = async (c: Context) => {
  const user_id = Number(c.req.param("id"));

  await unarchiveUserService(user_id);

  return c.json({
    success: true,
    message: "Unarhieve user successfully",
  }, 200)
};

export const deleteUser = async (c: Context) => {
  const user_id = Number(c.req.param("id"));

  await deleteUserService(user_id);

  return c.json({
    success: true,
    message: "Unarhieve user successfully",
   }, 200)
};
