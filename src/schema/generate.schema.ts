import { z } from "@hono/zod-openapi";
import type { ZodTypeAny } from "zod";
import { FakerMethods } from "../constant";

const BaseSchema: ZodTypeAny = z.lazy(() =>
  z
    .record(
      z.string(),
      z.union([
        FakerMethods.openapi({ type: "string" }),
        z
          .lazy(() => BaseSchema)
          .optional()
          .openapi({ type: "object" }),
        z
          .object({
            items: z
              .lazy(() => BaseSchema)
              .optional()
              .openapi({
                type: "object",
              }),
            count: z.number().max(10).optional().openapi({
              type: "number",
            }),
          })
          .openapi({ type: "object" }),
      ]),
    )
    .openapi({ type: "object" }),
);

export const GenerateBodySchemaRequest = z
  .object({
    schema: BaseSchema.openapi({
      type: "object",
    }),
    count: z.number().max(10).optional().openapi({
      type: "number",
    }),
    locale: z.string().optional().default("en").openapi({
      type: "string",
    }),
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

export type GenerateBodySchema = z.infer<typeof GenerateBodySchemaRequest>;
