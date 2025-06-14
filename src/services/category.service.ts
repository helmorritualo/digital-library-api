import {
  Category,
  createCategory,
  deleteCategory,
  getAllCategories,
  getBooksByCategory,
  getCategoryById,
  updateCategory,
} from "@/models/category.model";
import { BadRequestError, NotFoundError } from "@/utils/custom-error";

export const getAllCategoriesService = async () => {
  try {
    const categories = await getAllCategories();
    if (!categories || categories.length === 0) {
      throw new NotFoundError("Categories not found");
    }

    return categories;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const getBooksByCategoryService = async (categoryName: string) => {
  try {
    const books = await getBooksByCategory(categoryName);
    if (!books || books.length === 0) {
      throw new NotFoundError("Books not found for this category");
    }

    return books;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const getCategoryByIdService = async (id: number) => {
  try {
    const book = await getCategoryById(id);
    if (!book) {
      throw new NotFoundError("Book not found");
    }

    return book;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const createCategoryService = async (categoryData: Category) => {
  try {
    const category = await createCategory(categoryData);
    if (!category) {
      throw new BadRequestError("Failed to create category");
    }
    return category;
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const updateCategoryService = async (id: number, categoryData: Category) => {
  try {
    const category = await getCategoryById(id);
    if (!category) {
      throw new NotFoundError("Categoty not found");
    }

    const categoryUpdate = await updateCategory(id, categoryData);
    if (!categoryUpdate) {
      throw new BadRequestError("Failed to update category");
    }

    return categoryUpdate;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const deleteCategoryService = async (id: number) => {
  try {
    const category = await getCategoryById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const categoryDelete = await deleteCategory(id);
    if (!categoryDelete) {
      throw new BadRequestError("Failed to delete category");
    }

    return categoryDelete;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};
