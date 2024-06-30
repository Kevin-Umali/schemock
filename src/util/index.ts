import type { Context } from "hono";

export const generateInsertStatements = (results: Record<string, any>[], tableName: string, multiRowInsert: boolean): string => {
  if (multiRowInsert) {
    const columns = Object.keys(results[0]).join(", ");
    const values = results
      .map((record, index) => {
        const formattedValues = Object.values(record)
          .map((value) => `'${value}'`)
          .join(", ");
        return index === 0 ? `(${formattedValues})` : `\t(${formattedValues})`;
      })
      .join(",\n");
    return `INSERT INTO ${tableName} (${columns}) VALUES ${values};`;
  } else {
    return results
      .map((record) => {
        const columns = Object.keys(record).join(", ");
        const values = Object.values(record)
          .map((value) => `'${value}'`)
          .join(", ");
        return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
      })
      .join("\n");
  }
};

export const isIp = (value: string): boolean => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(?:\.(?!$)|$)){4}$/;
  const ipv6Regex =
    /^((?:[a-fA-F\d]{1,4}:){7}[a-fA-F\d]{1,4}|(?:[a-fA-F\d]{1,4}:){1,7}:|:(?::[a-fA-F\d]{1,4}){1,7}|::|(?:[a-fA-F\d]{1,4}:){1,6}:[a-fA-F\d]{1,4}|::(?:[a-fA-F\d]{1,4}:){0,5}:[a-fA-F\d]{1,4})$/;

  return ipv4Regex.test(value) || ipv6Regex.test(value);
};

export const extractClientIpFromHeaders = (c: Context): string | null => {
  const headers = [
    "x-client-ip",
    "x-forwarded-for",
    "cf-connecting-ip",
    "fastly-client-ip",
    "true-client-ip",
    "x-real-ip",
    "x-cluster-client-ip",
    "x-forwarded",
    "forwarded-for",
    "forwarded",
    "appengine-user-ip",
    "cf-pseudo-ipv4",
  ];

  for (const header of headers) {
    const rawValue: string | undefined = c.req.raw.headers.get(header.toLowerCase()) || undefined;
    if (typeof rawValue === "string") {
      const potentialIps = rawValue.split(",");
      for (const potentialIp of potentialIps) {
        const trimmedIp = potentialIp.trim();
        if (isIp(trimmedIp)) {
          return trimmedIp;
        }
      }
    }
  }

  return null;
};
