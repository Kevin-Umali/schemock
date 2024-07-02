import Fuse from "fuse.js";
import { FakerMethods } from "../constant";
import { ZodIssueCode, type ZodIssue } from "zod";

const validFakerMethods = FakerMethods.options.map((method) => ({ type: "method", value: method }));

const fuse = new Fuse(validFakerMethods, {
  keys: ["value"],
  includeScore: true,
  threshold: 0.4,
  distance: 100,
  useExtendedSearch: true,
});

export const formatToReadableError = (issue: ZodIssue): string | null => {
  const pathString = issue.path.join(".");

  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      return `The value for '${pathString}' must be of type ${issue.expected}.`;
    case ZodIssueCode.too_big:
      return `The value for '${pathString}' exceeds the maximum allowed value of ${issue.maximum}.`;
    case ZodIssueCode.too_small:
      return `The value for '${pathString}' is less than the minimum allowed value of ${issue.minimum}.`;
    case ZodIssueCode.invalid_string:
      switch (issue.validation) {
        case "email":
          return `The value for '${pathString}' must be a valid email address.`;
        case "url":
          return `The value for '${pathString}' must be a valid URL.`;
        default:
          return `The value for '${pathString}' is invalid.`;
      }
    case ZodIssueCode.invalid_literal:
      return `The value for '${pathString}' must be exactly ${JSON.stringify(issue.expected)}.`;
    case ZodIssueCode.custom:
      return issue.message || `The value for '${pathString}' is invalid.`;
    case ZodIssueCode.invalid_union:
      return `The value for '${pathString}' does not match any of the allowed types.`;
    case ZodIssueCode.invalid_union_discriminator:
      return `The value for '${pathString}' does not match any of the allowed discriminators.`;
    case ZodIssueCode.invalid_enum_value:
      return `The value for '${pathString}' must be one of the allowed values: ${issue.options.join(", ")}.`;
    case ZodIssueCode.unrecognized_keys:
      return `The object at '${pathString}' contains unrecognized keys: ${issue.keys.join(", ")}.`;
    case ZodIssueCode.invalid_arguments:
      return `Invalid arguments provided for '${pathString}'.`;
    case ZodIssueCode.invalid_return_type:
      return `Invalid return type for '${pathString}'.`;
    case ZodIssueCode.invalid_date:
      return `The value for '${pathString}' must be a valid date.`;
    case ZodIssueCode.invalid_intersection_types:
      return `The value for '${pathString}' has invalid intersection types.`;
    case ZodIssueCode.not_multiple_of:
      return `The value for '${pathString}' must be a multiple of ${issue.multipleOf}.`;
    case ZodIssueCode.not_finite:
      return `The value for '${pathString}' must be a finite number.`;
    default:
      return "Ensure the field uses a valid faker.js method or locale.";
  }
};

export const generateSuggestion = (path: string): string | null => {
  const extendedSearchQuery = `^${path} | ${path} | =${path}`;

  const result = fuse.search(extendedSearchQuery);

  if (result.length > 0 && result[0]?.score !== undefined && result[0].score < 0.4) {
    return `Did you mean '${result[0].item.value}' (${result[0].item.type})?`;
  }

  return null;
};
