import { z, createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { MockBodyPaginationRequest, MockQueryPaginationParams } from "../schema/mock.schema";
import { HTTPException } from "hono/http-exception";
import { generateFakeData } from "../lib/fakeDataGenerator";
import { sortNestedData } from "../util";

export const mock = new OpenAPIHono();

export const mockPaginationRoute = createRoute({
  method: "post",
  path: "/pagination",
  summary: "Mock Pagination",
  description: "Generate paginated data based on the provided schema.",
  request: {
    query: MockQueryPaginationParams,
    body: {
      content: {
        "application/json": {
          schema: MockBodyPaginationRequest,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z
            .object({
              data: z.array(z.any()),
              page: z.number(),
              limit: z.number(),
              total: z.number(),
            })
            .openapi({
              type: "object",
              example: {
                data: [
                  {
                    name: "John",
                    email: "oDpO7@example.com",
                  },
                  {
                    name: "Jane",
                    email: "12pO7@example.com",
                  },
                ],
                page: 1,
                limit: 10,
                total: 2,
              },
            }),
        },
      },
      description: "Generated mock paginated data.",
    },
  },
  tags: ["Mock Routes"],
});

mock.openapi(mockPaginationRoute, (c) => {
  const { schema, count, locale } = c.req.valid("json");
  const { page, limit, sort } = c.req.valid("query");

  if (!schema) {
    throw new HTTPException(400, {
      message: "Invalid schema",
    });
  }

  const pageInt = parseInt(page, 10);
  const limitInt = parseInt(limit, 10);

  const startIndex = (pageInt - 1) * limitInt;
  const endIndex = Math.min(startIndex + limitInt, count);
  console.log(startIndex, endIndex);

  if (startIndex >= count || startIndex < 0) {
    return c.json({ data: [], page: pageInt, limit: limitInt, total: count });
  }

  const actualLimit = endIndex - startIndex;

  let data = Array.from({ length: actualLimit }, () => generateFakeData(schema, locale));

  if (sort) {
    const [sortField, sortOrder] = sort.split(":");
    data = sortNestedData(data, sortField, sortOrder);
  }

  return c.json({ data, page: pageInt, limit: limitInt, total: count });
});
