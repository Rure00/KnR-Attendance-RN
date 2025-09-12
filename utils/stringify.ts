export function stringify(obj: any, indent = 2): string {
  return JSON.stringify(
    obj,
    (key, value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (value instanceof Error) {
        return {
          message: value.message,
          stack: value.stack,
          name: value.name,
        };
      }
      return value;
    },
    indent
  ).replace(/\\n/g, "\n");
}
