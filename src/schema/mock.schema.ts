import { z } from "@hono/zod-openapi";
import { commonFields, NestedBaseSchema } from "./base.schema";

export const MockBodyPaginationRequest = z
  .object({
    schema: NestedBaseSchema,
    ...commonFields,
  })
  .openapi({
    description: "Schema for generating fake data",
    type: "object",
    example: {
      schema: {
        user: {
          name: "person.firstName",
          email: "internet.email",
          address: {
            street: "location.streetAddress",
            city: "location.city",
            country: "location.country",
          },
        },
      },
      count: 20,
      locale: "en",
    },
  });

export const MockQueryPaginationParams = z
  .object({
    page: z.string().min(1).optional().default("1").openapi({ type: "string" }),
    limit: z.string().min(1).max(100).optional().default("10").openapi({ type: "string" }),
    sort: z.string().optional().openapi({ type: "string", example: "name:asc" }),
  })
  .openapi({
    type: "object",
    example: {
      page: "1",
      limit: "10",
      sort: "name:asc",
    },
  });

export type MockBodyPagination = z.infer<typeof MockBodyPaginationRequest>;
export type MockQueryPagination = z.infer<typeof MockQueryPaginationParams>;
