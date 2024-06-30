import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { timeout } from "hono/timeout";
import { secureHeaders } from "hono/secure-headers";
import { prettyJSON } from "hono/pretty-json";
import { generate, generateCSVRoute, generateJSONRoute, generateSQLRoute, generateTemplateRoute } from "./routes/generate.route";
import { logger } from "hono/logger";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";

const app = new OpenAPIHono().basePath("/api/v1");

app.doc("/doc", {
  info: {
    title: "Schemock API",
    version: "1.0.0",
    description:
      "Schemock is a schema-based data generator for APIs. It allows developers to generate mock data based on defined schemas, aiding in API development and testing.",
    license: {
      name: "MIT License",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  openapi: "3.0.0",
  servers: [
    {
      url: "/api/v1/generate",
      description: "Prefix for the generate route",
    },
  ],
  tags: [{ name: "Generate Routes", description: "Operations related to generate" }],
});

app.openAPIRegistry.registerPath(generateJSONRoute);
app.openAPIRegistry.registerPath(generateCSVRoute);
app.openAPIRegistry.registerPath(generateSQLRoute);
app.openAPIRegistry.registerPath(generateTemplateRoute);

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
  .route("/generate", generate)
  .notFound((c) => {
    return c.json(
      {
        message: "Not Found - Check the documentation for more information.",
        swagger: "/api/v1/doc",
      },
      404,
    );
  })
  .get(
    "/ui",
    apiReference({
      theme: "moon",
      pageTitle: "Schemock API",
      spec: {
        url: "/api/v1/doc",
      },
    }),
  );

export default {
  port: 3000,
  fetch: app.fetch,
};
