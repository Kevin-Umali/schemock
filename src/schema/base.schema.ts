import { z } from "@hono/zod-openapi";
import { Locales, FakerMethods } from "../constant";
import type { ZodTypeAny } from "zod";

export const CountSchema = z
  .number()
  .max(100)
  .openapi({
    type: "number",
  })

  .openapi({
    type: "number",
  });

export const LocaleSchema = Locales.openapi({
  type: "string",
});

export const BaseSchema: ZodTypeAny = z.record(z.string(), FakerMethods.openapi({ type: "string" })).openapi({
  type: "object",
});

export const NestedBaseSchema: ZodTypeAny = z.lazy(() =>
  z
    .record(
      z.string(),
      z.union([
        FakerMethods.openapi({ type: "string" }),
        z.string().optional().openapi({ type: "string" }),
        z.number().optional().openapi({ type: "number" }),
        z.date().optional().openapi({ type: "string" }),
        z.boolean().optional().openapi({ type: "boolean" }),
        z
          .lazy(() => NestedBaseSchema)
          .optional()
          .openapi({ type: "object" }),
        z
          .object({
            items: z
              .lazy(() => NestedBaseSchema)
              .optional()
              .openapi({
                type: "object",
              }),
            count: z.number().max(100).optional().openapi({
              type: "number",
            }),
          })
          .openapi({ type: "object" }),
      ]),
    )
    .openapi({ type: "object" }),
);

export const commonFields = {
  count: CountSchema,
  locale: LocaleSchema,
};
