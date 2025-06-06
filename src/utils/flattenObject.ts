export const flattenObject = (
  obj: any,
  prefix = "",
  result: Record<string, string> = {}
) => {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = String(value);
    }
  }
  return result;
};
