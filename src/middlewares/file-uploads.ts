import { Context, Next } from "hono";
import { BadRequestError } from "@/utils/custom-error";
import fs from 'fs'
import path from "path";
import { FileUploadConfig } from "@/types";

const ensureUploadDirExists = (uploadDir: string) => {
  const fullPath = path.join(process.cwd(), "uploads", uploadDir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
};

const getFileUrl = (fileName: string, uploadDir: string): string => {
  return `/uploads/${uploadDir}/${fileName}`;
};

export const createFileUploadMiddleware = (config: FileUploadConfig) => {
  const {
    fieldName,
    uploadDir,
    filePrefix,
    maxSizeInMB = 10,
    allowedTypes = ["image/"],
  } = config;

  ensureUploadDirExists(uploadDir);

  return async (c: Context, next: Next) => {
    try {
      const contentType = c.req.header("content-type");

      if (contentType && contentType.includes("multipart/form-data")) {
        const formData = await c.req.formData();
        const uploadedFile = formData.get(fieldName) as File;

        if (uploadedFile && uploadedFile.size > 0) {
          const isValidType = allowedTypes.some((type) =>
            uploadedFile.type.startsWith(type)
          );
          if (!isValidType) {
            throw new BadRequestError(
              "Invalid file type. Only image files are allowed!"
            );
          }

          const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
          if (uploadedFile.size > maxSizeInBytes) {
            throw new BadRequestError(
              `File too large. Maximum size is ${maxSizeInMB}MB.`
            );
          }

          // Generate unique filename
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const fileExtension = path.extname(uploadedFile.name);
          const fileName = `${filePrefix}-${uniqueSuffix}${fileExtension}`;

          // Save file to disk
          const uploadsPath = path.join(process.cwd(), "uploads", uploadDir);
          const filePath = path.join(uploadsPath, fileName);

          // Convert File to Buffer and save
          const arrayBuffer = await uploadedFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          fs.writeFileSync(filePath, buffer);

          const fileUrl = getFileUrl(fileName, uploadDir);
          c.set(
            `uploaded${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`,
            fileUrl
          );
        }
      }
      await next();
    } catch (error) {
      console.error("File upload error:", error);
      if (error instanceof BadRequestError) {
        throw error;
      }
    }
  };
};

// Pre-configured middleware instances
export const handleBookUpload = createFileUploadMiddleware({
  fieldName: "book",
  uploadDir: "books",
  filePrefix: "book",
  maxSizeInMB: 50,
  allowedTypes: [
    "text/plain",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
 ],
});

export const handleProfilePictureUpload = createFileUploadMiddleware({
  fieldName: "profilePicture",
  uploadDir: "profile-pictures",
  filePrefix: "profile",
  maxSizeInMB: 5,
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff"
  ],
});

export const deleteUploadedFile = (
  filePath: string,
  uploadDir: string = "book"
) => {
  try {
    const fullPath = path.join(
      process.cwd(),
      "uploads",
      uploadDir,
      path.basename(filePath)
    );
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file")
  }
};
