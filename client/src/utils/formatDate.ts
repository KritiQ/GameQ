export function formatDate(dateString?: string | null) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  return date.toLocaleDateString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
