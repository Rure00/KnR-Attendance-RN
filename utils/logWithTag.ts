export function logWithTag(tag: string, ...msgs: any[]) {
  console.log(
    "\x1b[33m%s\x1b[0m",
    `${tag}:`,
    ...msgs.map((m) => (typeof m === "object" ? JSON.stringify(m, null, 2) : m))
  );
}
