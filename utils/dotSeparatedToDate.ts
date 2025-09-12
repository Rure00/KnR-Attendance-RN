export function dotSeparatedToDate(dateString: string): Date {
  const [year, month, day] = dateString
    .split(".")
    .map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day); // month는 0-based
}
