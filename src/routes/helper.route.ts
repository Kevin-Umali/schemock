import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { formatToReadableError } from "../lib/errorSuggestions";
import { HelperPathParameter } from "../schema/helper.schema";
import { FakerMethods, Locales } from "../constant";

export const helper = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          errors: result.error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
            readableMessage: formatToReadableError(e),
          })),
        },
        422,
      );
    }
  },
});

export const helperEnumRoutes = createRoute({
  method: "get",
  path: "/helper/enum/{name}",
  request: {
    params: HelperPathParameter,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z
            .object({
              data: z.array(z.string()),
            })
            .openapi({
              type: "object",
              example: {
                data: ["datatype.number", "datatype.float", "datatype.datetime"],
              },
            }),
        },
      },
      description: "Helper to get the options for the given enum",
    },
  },
  tags: ["Helper Routes"],
});

helper.openapi(helperEnumRoutes, (c) => {
  const { name } = c.req.valid("param");
  let options: string[] = [];
  switch (name) {
    case "faker":
      options = FakerMethods.options;
      break;
    case "locale":
      options = Locales.options;
      break;
    default:
      options = [];
  }

  return c.json({ data: options });
});
