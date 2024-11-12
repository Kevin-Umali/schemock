import { z } from "@hono/zod-openapi";
import { NestedBaseSchema, commonFields, BaseSchema } from "./base.schema";

export const GenerateBodyJSONRequest = z
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
      count: 1,
      locale: "en",
    },
  });

export const GenerateBodyCSVRequest = z
  .object({
    schema: BaseSchema,
    ...commonFields,
  })
  .openapi({
    description: "Schema for generating csv fake data",
    type: "object",
    example: {
      schema: {
        name: "person.firstName",
        email: "internet.email",
      },
      count: 10,
      locale: "en",
    },
  });

export const GenerateBodySQLRequest = z
  .object({
    schema: BaseSchema,
    ...commonFields,
    tableName: z.string().min(1).openapi({ type: "string" }),
    multiRowInsert: z.boolean().optional().default(true).openapi({ type: "boolean" }),
  })
  .openapi({
    description: "Schema for generating sql fake data",
    type: "object",
    example: {
      schema: {
        name: "person.firstName",
        email: "internet.email",
      },
      count: 10,
      locale: "en",
      tableName: "users",
      multiRowInsert: true,
    },
  });

export const GenerateBodyTemplateRequest = z
  .object({
    template: z.string().openapi({
      type: "string",
    }),
    count: z.number().max(100).optional().openapi({
      type: "number",
    }),
    locale: z.string().optional().default("en").openapi({
      type: "string",
    }),
  })
  .openapi({
    description: "Schema for generating fake data based on templates",
    type: "object",
    example: {
      template: "Hello, my name is {{person.firstName}} {{person.lastName}} and my email is {{internet.email}}.",
      count: 1,
      locale: "en",
    },
  });

// prettier-ignore
export type GenerateBodyJSON = z.infer<typeof GenerateBodyJSONRequest>;
// prettier-ignore
export type GenerateBodyCSV = z.infer<typeof GenerateBodyCSVRequest>;
// prettier-ignore
export type GenerateBodySQL = z.infer<typeof GenerateBodySQLRequest>;
// prettier-ignore
export type GenerateBodyTemplate = z.infer<typeof GenerateBodyTemplateRequest>;
