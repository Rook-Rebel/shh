export function formatDate(date: string, style: "short" | "long" = "short"): string {
  return new Date(date).toLocaleDateString(
    "en-US",
    style === "long"
      ? { year: "numeric", month: "long", day: "numeric" }
      : { year: "numeric", month: "short", day: "numeric" }
  );
}
