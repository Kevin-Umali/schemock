import { Faker } from "@faker-js/faker";
import { localeMap } from "../constant";

interface BaseSchema {
  count?: number;
  items?: GenerateSchema;
}

interface GenerateSchema {
  [key: string]: string | BaseSchema | GenerateSchema;
}

const CustomFakerFunctions: { [key: string]: () => string } = {
  customFunction: () => "Custom Value",
};

/**
 * Checks if the given value is a schema array.
 *
 * @param {unknown} value - The value to check.
 * @return {value is BaseSchema} - Returns true if the value is a schema array, false otherwise.
 */
const isSchemaArray = (value: unknown): value is BaseSchema => {
  return typeof value === "object" && value !== null && ("items" in value || "count" in value);
};

/**
 * Retrieves a nested function from an object based on a given path.
 *
 * @param {Record<string, any>} obj - The object to search for the nested function.
 * @param {string} path - The path to the nested function, separated by periods.
 * @return {() => any} - The nested function.
 * @throws {Error} - If the path is invalid at any part.
 */
const getNestedFunction = (obj: Record<string, any>, path: string): (() => any) => {
  return path.split(".").reduce((acc: any, part: string) => {
    if (acc && acc[part] !== undefined) {
      return acc[part];
    }
    throw new Error(`Path ${path} is invalid at part ${part}`);
  }, obj);
};

/**
 * Handles a string schema value by retrieving the corresponding Faker function and executing it.
 *
 * @param {string} value - The string schema value to handle.
 * @param {Faker} fakerInstance - The Faker instance to use for generating fake data.
 * @return {any} - The result of executing the Faker function, or an error message if the function is not found.
 */
const handleStringSchema = (value: string, fakerInstance: Faker): any => {
  try {
    let fakerFunction: () => any;
    if (value.startsWith("custom.")) {
      const customFunctionKey = value.split(".")[1];
      fakerFunction = CustomFakerFunctions[customFunctionKey];
      if (!fakerFunction) {
        throw new Error(`Custom faker function not found: ${customFunctionKey}`);
      }
    } else {
      fakerFunction = getNestedFunction(fakerInstance as unknown as Record<string, any>, value);
      if (typeof fakerFunction !== "function") {
        throw new Error(`Faker function not found: ${value}`);
      }
    }
    return fakerFunction();
  } catch (error) {
    console.log(error);
    return `Error accessing function: ${value}`;
  }
};

/**
 * Handles an array schema value by generating fake data based on the provided count or items.
 *
 * @param {BaseSchema} value - The array schema value to handle.
 * @param {string} locale - The locale for generating the fake data.
 * @return {any} The generated fake data based on the array schema value.
 */
const handleSchemaArray = (value: BaseSchema, locale: string): any => {
  if (value.count) {
    return Array.from({ length: value.count }, () => generateFakeData(value.items || {}, locale));
  } else if (value.items) {
    return generateFakeData(value.items, locale);
  } else {
    return [];
  }
};

/**
 * Generates fake data based on the provided schema.
 *
 * @param {GenerateSchema} schema - The schema to generate fake data from.
 * @param {string} [locale="en"] - The locale for generating the fake data. Defaults to "en".
 * @return {Record<string, any>} The generated fake data.
 */
export const generateFakeData = (schema: GenerateSchema, locale: string = "en"): Record<string, any> => {
  const fakerInstance = new Faker({
    locale: localeMap[locale] || localeMap["en"], // Default to 'en' if locale not found
  });

  const fakeData: Record<string, any> = {};

  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === "string") {
      fakeData[key] = handleStringSchema(value, fakerInstance);
    } else if (isSchemaArray(value)) {
      fakeData[key] = handleSchemaArray(value, locale);
    } else if (typeof value === "object" && value !== null) {
      fakeData[key] = generateFakeData(value, locale);
    } else {
      fakeData[key] = `Unhandled type for key: ${key}`;
    }
  }

  return fakeData;
};
