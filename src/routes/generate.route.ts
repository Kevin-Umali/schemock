import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { GenerateBodySchemaRequest } from "../schema/generate.schema";
import { HTTPException } from "hono/http-exception";
import { generateFakeData } from "../util/generateFakeData";

const generate = new Hono();

generate.post("/schema", zValidator("json", GenerateBodySchemaRequest), (c) => {
  const { schema, count, locale } = c.req.valid("json");

  if (!schema) {
    throw new HTTPException(400, {
      message: "Invalid schema",
    });
  }

  const results = Array.from({ length: count ?? 1 }, () => generateFakeData(schema, locale));
  return results.length === 1 ? c.json({ data: results[0] }) : c.json({ data: results });
});

export default generate;
