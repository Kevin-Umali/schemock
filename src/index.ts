import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { timeout } from "hono/timeout";
import { secureHeaders } from "hono/secure-headers";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { rateLimiter } from "hono-rate-limiter";
import { isIp, extractClientIpFromHeaders } from "./util";
import { FakerMethods, Locales } from "./constant";
import { mock, generate } from "./routes/index.route";
import { generateCSVRoute, generateJSONRoute, generateSQLRoute, generateTemplateRoute } from "./routes/generate.route";
import { mockPaginationRoute } from "./routes/mock.route";
import { helper, helperEnumRoutes } from "./routes/helper.route";

const app = new OpenAPIHono().basePath("/api/v1");

app.doc("/doc", {
  info: {
    title: "Schemock API",
    version: "1.1.1",
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
    {
      url: "/api/v1/mock",
      description: "Prefix for the mock route",
    },
    {
      url: "/api/v1/helper",
      description: "Prefix for the helper route",
    },
  ],
  tags: [
    { name: "Generate Routes", description: "Operations related to generate, make sure you're using the `/api/v1/generate` endpoint " },
    { name: "Mock Routes", description: "Operations related to mock, make sure you're using the `/api/v1/mock` endpoint" },
    { name: "Helper Routes", description: "Operations related to helper, make sure you're using the `/api/v1/helper` endpoint" },
  ],
});

app.openAPIRegistry.registerPath(generateJSONRoute);
app.openAPIRegistry.registerPath(generateCSVRoute);
app.openAPIRegistry.registerPath(generateSQLRoute);
app.openAPIRegistry.registerPath(generateTemplateRoute);
app.openAPIRegistry.registerPath(mockPaginationRoute);
app.openAPIRegistry.registerPath(helperEnumRoutes);
app.openAPIRegistry.registerComponent("schemas", "FakerMethods", {
  type: "string",
  enum: FakerMethods.options,
  example: {
    schema: {
      firstName: "person.firstName",
    },
    count: 1,
    locale: "en",
  },
  description: "Enumeration of Faker.js methods",
});
app.openAPIRegistry.registerComponent("schemas", "Locales", {
  type: "string",
  enum: Locales.options,
  example: {
    schema: {},
    count: 1,
    locale: "ja",
  },
  description: "Enumeration of supported locales",
});

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
  .use(
    rateLimiter({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      standardHeaders: true,
      keyGenerator: (c) => {
        let ip: string | null | undefined =
          c.req.raw.headers.get("x-forwarded-for") ?? c.req.raw.headers.get("x-real-ip") ?? c.req.raw.headers.get("cf-connecting-ip");

        if (!ip) {
          ip = c.req.raw.headers.get("remote-addr");
        }

        if (ip) {
          ip = ip.replace(/:\d+[^:]*$/, "");
        }

        if (ip && isIp(ip)) {
          return ip;
        } else {
          ip = extractClientIpFromHeaders(c);
          if (ip) {
            return ip;
          } else {
            console.warn("Warning: Unable to extract client IP, defaulting to 'unknown'");
            return "unknown";
          }
        }
      },
    }),
  )
  .use(prettyJSON())
  .route("/generate", generate)
  .route("/mock", mock)
  .route("/helper", helper)
  .notFound((c) => {
    return c.json(
      {
        message: "Not Found - Check the documentation for more information.",
        swagger: "/api/v1/ui",
      },
      404,
    );
  })
  .get(
    "/ui",
    apiReference({
      theme: "alternate",
      pageTitle: "Schemock API",
      spec: {
        url: "/api/v1/doc",
      },
      hideDownloadButton: true,
      layout: "modern",
      showSidebar: true,
      searchHotKey: "k",
      metaData: {
        title: "Schemock API",
        description: "Schemock API Documentation",
      },
      withDefaultFonts: true,
    }),
  )
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    return c.json({ sucess: false, error: err.message }, 500);
  });

export default {
  port: 3000,
  fetch: app.fetch,
  // app: app,
};
