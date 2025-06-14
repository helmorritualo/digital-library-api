import { getValidatedData } from "@/middlewares/global-validator";
import {
  createCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getBooksByCategoryService,
  getCategoryByIdService,
  updateCategoryService,
} from "@/services/category.service";
import { categorySchema } from "@/validations/category.schema";
import { Context } from "hono";
import { z } from "zod/v4";

export const getAllCategories = async (c: Context) => {
  const categories = await getAllCategoriesService();

  return c.json(
    {
      success: true,
      data: categories,
    },
    200
  );
};

export const getCategoryById = async (c: Context) => {
  const category_id = Number(c.req.param("id"));

  const category = await getCategoryByIdService(category_id);

  return c.json(
    {
      success: true,
      data: category,
    },
    200
  );
};

export const getBooksByCategory = async (c: Context) => {
  const category_name = c.req.param("category_name");

  const getBooksByCategory = getBooksByCategoryService(category_name);

  return c.json(
    {
      success: true,
      data: getBooksByCategory,
    },
    200
  );
};

export const createCategory = async (c: Context) => {
  const categoryData = getValidatedData<z.infer<typeof categorySchema>>(c, "json");

  const category = await createCategoryService(categoryData);

  return c.json(
    {
      success: true,
      message: "Category successfully created",
      data: category,
    },
    201
  );
};

export const updateCategory = async (c: Context) => {
  const updateCategoryData = getValidatedData<z.infer<typeof categorySchema>>(c, "json");
  const category_id = Number(c.req.param("id"));

  const category = await updateCategoryService(category_id, updateCategoryData);

  return c.json(
    {
      success: true,
      message: "Category successfully updated",
      data: category,
    },
    201
  );
};

export const deleteCategory = async (c: Context) => {
  const category_id = Number(c.req.param("id"));

  await deleteCategoryService(category_id);

  return c.json(
    {
      success: true,
      message: "Category deleted successfully",
    },
    200
  );
};
