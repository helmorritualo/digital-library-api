  import { Hono } from "hono";
  import { getAllCategories, getBooksByCategory, getCategoryById, createCategory, updateCategory, deleteCategory } from "./category.controller";
  import { authMiddleware, requireAdmin } from "@/middlewares/authentication";
  import { categorySchema } from "@/validations/category.schema";
  import { validateJson } from "@/middlewares/global-validator";

  const categoryRouter = new Hono();

  categoryRouter.get("/categories", authMiddleware, getAllCategories);
  categoryRouter.get("/categories/:id", authMiddleware, getCategoryById);
  categoryRouter.get("/categories/:category_name", authMiddleware, getBooksByCategory);

  categoryRouter.post("/categories", authMiddleware, requireAdmin, validateJson(categorySchema), createCategory);
  categoryRouter.put("/categories/:id", authMiddleware, requireAdmin, validateJson(categorySchema), updateCategory);
  categoryRouter.delete("/categories/:id", authMiddleware, requireAdmin, deleteCategory);
  
