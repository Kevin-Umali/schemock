import { GenerateBodyCSVRequest, GenerateBodyJSONRequest, GenerateBodySQLRequest } from "../schema/generate.schema";
import { HTTPException } from "hono/http-exception";
import { generateFakeData } from "../util/generateFakeData";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { createObjectCsvStringifier } from "csv-writer";
import { generateInsertStatements } from "../util";

export const generate = new OpenAPIHono();

export const generateJSONRoute = createRoute({
  method: "post",
  path: "/json",
  request: {
    body: {
      content: {
        "application/json": {
          schema: GenerateBodyJSONRequest,
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

generate.openapi(generateJSONRoute, (c) => {
  const { schema, count, locale } = c.req.valid("json");

  if (!schema) {
    throw new HTTPException(400, {
      message: "Invalid schema",
    });
  }

  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema, locale));
  return results.length === 1 ? c.json({ data: results[0] }) : c.json({ data: results });
});

export const generateCSVRoute = createRoute({
  method: "post",
  path: "/csv",
  request: {
    body: {
      content: {
        "application/json": {
          schema: GenerateBodyCSVRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "text/plain": {
          schema: z.string().openapi({
            type: "string",
            example: "name,email\nAngilbe,Francine2@yahoo.fr",
          }),
        },
      },
      description: "Generated CSV",
    },
  },
  tags: ["Generate Routes"],
});

generate.openapi(generateCSVRoute, (c) => {
  const { schema, count, locale } = c.req.valid("json");
  if (!schema) {
    throw new HTTPException(400, {
      message: "Invalid schema",
    });
  }
  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema, locale));
  const csvStringifier = createObjectCsvStringifier({
    header: Object.keys(results[0]).map((key) => ({ id: key, title: key })),
  });

  const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(results);

  return c.text(csvContent, 200, {
    "Content-Length": Buffer.byteLength(csvContent).toString(),
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": 'attachment; filename="fake_data.csv"',
  });
});

export const generateSQLRoute = createRoute({
  method: "post",
  path: "/sql",
  request: {
    body: {
      content: {
        "application/json": {
          schema: GenerateBodySQLRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "text/sql": {
          schema: z.string().openapi({
            type: "string",
            example: "INSERT INTO users (name, email) VALUES ('Quinn', 'Luther15@hotmail.com');",
          }),
        },
      },
      description: "Generated SQL",
    },
  },
  tags: ["Generate Routes"],
});

generate.openapi(generateSQLRoute, (c) => {
  const { schema, count, locale, tableName, multiRowInsert } = c.req.valid("json");
  if (!schema) {
    throw new HTTPException(400, {
      message: "Invalid schema",
    });
  }
  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema, locale));
  const insertStatements = generateInsertStatements(results, tableName, multiRowInsert);

  return c.text(insertStatements, 200, {
    "Content-Length": Buffer.byteLength(insertStatements).toString(),
    "Content-Type": "text/sql; charset=utf-8",
    "Content-Disposition": 'attachment; filename="fake_data.sql"',
  });
});
