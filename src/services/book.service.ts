import {
  Book,
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  seachBooks,
  updateBook,
} from "@/models/book.model";
import { BadRequestError, NotFoundError } from "@/utils/custom-error";

export const getAllBooksService = async () => {
  try {
    const books = await getAllBooks();
    if (!books || books.length === 0) {
      throw new NotFoundError("Books not found");
    }

    return books;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const getBookByIdService = async (id: number) => {
  try {
    const book = getBookById(id);
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

export const searchBooksService = async (search: string) => {
  try {
    const getSearchBooks = await seachBooks(search);
    if (getSearchBooks.length === 0) {
      throw new NotFoundError("Books not found");
    }
    return getSearchBooks;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const createBookService = async (bookData: Book) => {
  try {
    const book = await createBook(bookData);
    if (!book) {
      throw new BadRequestError("Failed to create book");
    }
    return book;
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const updateBookService = async (id: number, updateData: Partial <Book>) => {
  try {
    const book = await getBookById(id);
    if (!book) {
      throw new NotFoundError("Book not found");
    }

    const bookUpdateData = await updateBook(id, updateData);
    if (!bookUpdateData) {
      throw new BadRequestError("Failed to update book");
    }

    return bookUpdateData;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const deleteBookService = async (id: number) => {
  try {
    const book = await getBookById(id);
    if (!book) {
      throw new NotFoundError("Book not found");
    }

    const bookDelete = await deleteBook(id);
    if (!bookDelete) {
      throw new BadRequestError("Failed to delete book");
    }
    return bookDelete;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};
