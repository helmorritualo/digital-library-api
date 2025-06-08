import { BadRequestError } from "@/utils/custom-error";
import { Context, Next } from "hono";
import { z } from "zod/v4";

type ValidationTarget = "json" | "query" | "param" | "header";

const validator = <T extends z.ZodSchema>(target: ValidationTarget, schema: T) => {
  return async (c: Context, next: Next) => {
    try {
      let data: unknown;

      switch (target) {
        case "json":
          data = await c.req.json();
          break;
        case "query":
          data = c.req.query();
          break;
        case "header":
          data = Object.fromEntries(c.req.raw.headers.entries());
          break;
        default:
          throw new BadRequestError(`Invalid validation target: ${target}`);
      }

      const result = schema.safeParse(data);

      c.set(`validated_${target}`, result.data);

      await next();
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        const errorMessage = zodError.issues.map((issue) => `${issue.message}`).join(", ");
        throw new BadRequestError(errorMessage);
      }
      throw new BadRequestError("Invalid request data");
    }
  };
};

// Convenience functions for common use cases
export const validateJson = <T extends z.ZodSchema>(schema: T) => validator("json", schema);

export const validateQuery = <T extends z.ZodSchema>(schema: T) => validator("query", schema);

export const validateHeader = <T extends z.ZodSchema>(schema: T) => validator("header", schema);

// Helper to get validated data from context
export const getValidatedData = <T>(c: Context, target: ValidationTarget): T => {
  return c.get(`validated_${target}`) as T;
};
