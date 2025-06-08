import { findUserById } from "@/models/auth.model";
import {
  archiveUser,
  deleteUser,
  getAllUsers,
  unarchieveUser,
  updateUser,
  User,
} from "@/models/user.model";
import { BadRequestError, NotFoundError } from "@/utils/custom-error";

export const getAllUserService = async () => {
  try {
    const users = await getAllUsers();
    if (!users || users.length === 0) {
      throw new NotFoundError("Users not found");
    }

    return users;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};

export const updateUserService = async (id: number, userData: User) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updateUserData = await updateUser(id, userData);
    if (!updateUserData) {
      throw new BadRequestError("Failed to update user");
    }

    return user;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const archiveUserService = async (id: number) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const archive = await archiveUser(id);
    if (!archive) {
      throw new BadRequestError("Failed to archieve user");
    }

    return archive;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const UnarchiveUserService = async (id: number) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const unarchive = await unarchieveUser(id);
    if (!unarchive) {
      throw new BadRequestError("Failed to archieve user");
    }

    return unarchive;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
  }
};

export const deleteUserService = async (id: number) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const userDelete = await deleteUser(id);

    return userDelete;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
  }
};
