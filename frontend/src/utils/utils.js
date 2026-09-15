export function formatDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function truncate(text, length = 120) {
  return text.length > length ? `${text.slice(0, length).trimEnd()}...` : text;
}
