import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { timeout } from "hono/timeout";
import { secureHeaders } from "hono/secure-headers";
import { prettyJSON } from "hono/pretty-json";
import generate from "./routes/generate.route";
import { swaggerUI } from "@hono/swagger-ui";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api/v1");

app
  .use(secureHeaders())
  .use(logger())
  .use(
    cors({
      origin: "*",
      allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .use(
    timeout(
      60000,
      () =>
        new HTTPException(408, {
          message: "Request Timeout after waiting 60 seconds. Please try again later.",
        }),
    ),
  )
  .use(prettyJSON())
  .get(
    "/ui",
    swaggerUI({
      url: "/doc",
    }),
  )
  .route("/generate", generate)
  .notFound((c) => {
    return c.json(
      {
        message: "Not Found",
        availableRoutes: [
          {
            prefix: "/api/v1",
            routes: [
              {
                prefix: "/generate",
                routes: [
                  {
                    method: "POST",
                    path: "/schema",
                    description: "Generate fake data based on a schema",
                  },
                ],
              },
              {
                method: "GET",
                path: "/ui",
                description: "Documentation of this api",
              },
            ],
          },
        ],
      },
      404,
    );
  });

export default app;
