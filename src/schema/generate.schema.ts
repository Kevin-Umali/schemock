import { z, type ZodTypeAny } from "zod";
import { FakerMethods } from "../constant";

// Define the base schema using Zod

const BaseSchema: ZodTypeAny = z.lazy(() =>
  z.record(
    z.string(),
    z.union([
      FakerMethods,
      z.lazy(() => BaseSchema).optional(),
      z.object({
        items: z.lazy(() => BaseSchema).optional(),
        count: z.number().max(10).optional(),
      }),
    ]),
  ),
);

// Define the main schema
export const GenerateBodySchemaRequest = z.object({
  schema: BaseSchema,
  count: z.number().max(10).optional(),
  locale: z.string().optional().default("en"),
});

// Define the type for the schema
export type GenerateBodySchema = z.infer<typeof GenerateBodySchemaRequest>;
