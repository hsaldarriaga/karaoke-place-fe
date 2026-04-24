function isValidDate(value: Date | null): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export function formatDateRange(
  startTime?: string,
  hours?: number | string,
): string {
  if (!startTime) {
    return "Date to be announced";
  }

  const start = new Date(startTime);

  if (!isValidDate(start)) {
    return "Date to be announced";
  }

  const parsedHours = typeof hours === "string" ? Number(hours) : hours;
  const end =
    Number.isFinite(parsedHours) && (parsedHours ?? 0) > 0
      ? new Date(start.getTime() + Number(parsedHours) * 60 * 60 * 1000)
      : null;

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

  if (isValidDate(end)) {
    const sameDay = start.toDateString() === end.toDateString();

    return sameDay
      ? `${dateFormatter.format(start)} – ${timeFormatter.format(end)}`
      : `${dateFormatter.format(start)} → ${dateFormatter.format(end)}`;
  }

  return dateFormatter.format(start);
}
