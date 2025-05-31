export type FileUploadConfig = {
  fieldName: string;
  uploadDir: string;
  filePrefix: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}
