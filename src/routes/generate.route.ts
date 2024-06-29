import { GenerateBodySchemaRequest } from "../schema/generate.schema";
import { HTTPException } from "hono/http-exception";
import { generateFakeData } from "../util/generateFakeData";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";

export const generate = new OpenAPIHono();

export const generateSchemaRoute = createRoute({
  method: "post",
  path: "/schema",
  request: {
    body: {
      content: {
        "application/json": {
          schema: GenerateBodySchemaRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z
            .object({
              data: z.record(z.any()),
            })
            .openapi({
              type: "object",
              example: {
                data: {
                  user: {
                    name: "Quinn",
                    email: "Luther15@hotmail.com",
                    address: {
                      street: "240 Mante Gateway",
                      city: "Kamrenshire",
                      country: "Canada",
                    },
                  },
                },
              },
            }),
        },
      },
      description: "Generated data",
    },
  },
  tags: ["Generate Routes"],
});

generate.openapi(generateSchemaRoute, (c) => {
  const { schema, count, locale } = c.req.valid("json");

  if (!schema) {
    throw new HTTPException(400, {
      message: "Invalid schema",
    });
  }

  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema, locale));
  return results.length === 1 ? c.json({ data: results[0] }) : c.json({ data: results });
});
