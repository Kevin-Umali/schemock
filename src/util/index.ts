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
