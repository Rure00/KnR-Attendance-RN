export function stringify(obj: any, indent = 2): string {
  return JSON.stringify(
    obj,
    (key, value) => {
      // Date는 사람이 보기 쉽게 ISO 문자열로
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    },
    indent
  );
}
