import { findUserById } from "@/models/auth.model";
import { getAccessTokenFromCookie } from "@/utils/cookies";
import { ForbiddenError, NotFoundError } from "@/utils/custom-error";
import { verifyAccessToken } from "@/utils/jwt";
import { Context, Next } from "hono";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const accessToken = getAccessTokenFromCookie(c);

    if (!accessToken) {
      throw new NotFoundError("Access token not found");
    }

    // Verify access token
    let payload;
    try {
      payload = await verifyAccessToken(accessToken);
    } catch (error) {
      throw new ForbiddenError("Invalid access token");
    }

    const user = await findUserById(payload.userId as number);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    c.set("user_id", user.id);

    await next();
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
  }
};

export const requireAdmin = async (c: Context, next: Next) => {
  try {
    const userId = c.get("user_id");
    if (!userId) {
      throw new ForbiddenError("Authentication required");
    }

    const user = await findUserById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.role !== "admin") {
      throw new ForbiddenError("Admin access required");
    }

    await next();
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      throw error;
    }
  }
};
