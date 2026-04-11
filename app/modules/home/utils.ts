export function normalizeId(value: unknown): string {
  return value == null ? "" : String(value);
}

function isValidDate(value: Date | null): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function formatDateRange(startTime?: string, endTime?: string): string {
  if (!startTime && !endTime) {
    return "Date to be announced";
  }

  const start = startTime ? new Date(startTime) : null;
  const end = endTime ? new Date(endTime) : null;

  if (!isValidDate(start) && !isValidDate(end)) {
    return "Date to be announced";
  }

  const dateFormatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const timeFormatter = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isValidDate(start) && isValidDate(end)) {
    const sameDay = start.toDateString() === end.toDateString();

    return sameDay
      ? `${dateFormatter.format(start)} – ${timeFormatter.format(end)}`
      : `${dateFormatter.format(start)} → ${dateFormatter.format(end)}`;
  }

  return dateFormatter.format(start ?? end ?? new Date());
}
