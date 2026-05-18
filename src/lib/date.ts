const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Parse YYYY-MM-DD by hand: avoids the UTC-vs-local off-by-one that
// `new Date("2021-08-01")` causes in negative-offset timezones.
export function formatMonthYear(iso?: string | null): string {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const month = MONTHS[Number(m[2]) - 1] ?? "";
  return `${month} ${m[1]}`.trim();
}
