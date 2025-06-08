import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { JwtVariables } from "hono/jwt";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { databaseConnection } from "./config/database";
import { PORT } from "./config/env";
import { routes } from "./controllers/routes";
import cleanExpiredToken from "./jobs/clean-expired-tokens";
import { errorHandlerMiddleware } from "./middlewares/error-handler";

const app = new Hono<{ Variables: JwtVariables }>();

// Middlewares
app.use("*", logger());
app.use(secureHeaders());
app.use(
  "*",
  cors({
    origin: ["*"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    credentials: true,
    maxAge: 600,
  })
);
app.onError(errorHandlerMiddleware); // Custom error handler

// Routes
routes.forEach((route) => {
  app.route("/api/v1/", route);
});

serve({ fetch: app.fetch, port: Number(PORT) || 3000 }, async (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);

  // Database connection
  await databaseConnection();

  // Start the job to clean expired tokens
  await cleanExpiredToken();
});
