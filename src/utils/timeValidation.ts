export type TimeRangeResult =
  | { ok: true; start: Date; end: Date }
  | { ok: false; message: string };

export function parseTimeRange(
  startInput: unknown,
  endInput: unknown,
): TimeRangeResult {
  const start = new Date(startInput as string);
  const end = new Date(endInput as string);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      ok: false,
      message:
        "Invalid start_time or end_time format. Use ISO 8601, e.g. 2026-06-20T10:00:00.000Z",
    };
  }

  if (start >= end) {
    return { ok: false, message: "End time must be later than start time" };
  }

  return { ok: true, start, end };
}
