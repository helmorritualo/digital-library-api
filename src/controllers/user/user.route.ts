import { authMiddleware, requireAdmin } from "@/middlewares/authentication";
import { Hono } from "hono";
import { getUserProfile, getAllUsers, updateUser, archiveUser, unArchieveUser, deleteUser } from "./user.controller";
import userSchema from "@/validations/user.schema";
import { validateJson } from "@/middlewares/global-validator";

const userRouter = new Hono();
userRouter.get("/profile/me", authMiddleware, getUserProfile);
userRouter.put("/profile/me", authMiddleware, validateJson(userSchema), updateUser);
userRouter.get("/users", authMiddleware, requireAdmin, getAllUsers);
userRouter.patch("/user/:id", authMiddleware, requireAdmin, deleteUser);
userRouter.patch("/users/:id/archieve", authMiddleware, requireAdmin, archiveUser);
userRouter.patch("/users/:id/unarchieve", authMiddleware, requireAdmin, unArchieveUser);

export default userRouter;
