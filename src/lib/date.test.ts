import { describe, it, expect } from "vitest";
import { formatMonthYear } from "@/lib/date";

describe("formatMonthYear", () => {
  it("formats a YYYY-MM-DD ISO string as 'Mon YYYY'", () => {
    expect(formatMonthYear("2021-08-01")).toBe("Aug 2021");
  });

  it("formats a YYYY-MM prefix (no day) the same way", () => {
    expect(formatMonthYear("2024-01")).toBe("Jan 2024");
  });

  it("formats a full ISO datetime by reading only the leading YYYY-MM", () => {
    expect(formatMonthYear("2019-12-25T10:30:00.000Z")).toBe("Dec 2019");
  });

  it("maps each month index correctly (01 -> Jan, 12 -> Dec)", () => {
    expect(formatMonthYear("2020-01-15")).toBe("Jan 2020");
    expect(formatMonthYear("2020-06-15")).toBe("Jun 2020");
    expect(formatMonthYear("2020-12-15")).toBe("Dec 2020");
  });

  it("is timezone-safe: a UTC-midnight date does not roll back a month", () => {
    // The manual parse avoids new Date("2021-08-01") off-by-one in negative offsets.
    expect(formatMonthYear("2021-08-01")).toBe("Aug 2021");
    expect(formatMonthYear("2021-01-01")).toBe("Jan 2021");
  });

  it("returns '' for undefined (present/ongoing)", () => {
    expect(formatMonthYear(undefined)).toBe("");
  });

  it("returns '' for null (present/ongoing)", () => {
    expect(formatMonthYear(null)).toBe("");
  });

  it("returns '' for an empty string", () => {
    expect(formatMonthYear("")).toBe("");
  });

  it("returns the input unchanged when it does not start with YYYY-MM", () => {
    expect(formatMonthYear("Present")).toBe("Present");
    expect(formatMonthYear("not-a-date")).toBe("not-a-date");
    expect(formatMonthYear("2021")).toBe("2021");
  });

  it("yields an empty month token (just the year) for an out-of-range month like 00 or 13", () => {
    // MONTHS[Number("00") - 1] === MONTHS[-1] === undefined -> "" , then .trim()
    expect(formatMonthYear("2021-00-01")).toBe("2021");
    // MONTHS[Number("13") - 1] === MONTHS[12] === undefined -> "" , then .trim()
    expect(formatMonthYear("2021-13-01")).toBe("2021");
  });
});
