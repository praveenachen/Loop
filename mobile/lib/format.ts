// Chat timestamps arrive as ISO strings; show a short local clock time ("4:12 PM"), with the weekday for older messages.
export function formatMessageTime(iso: string, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const clock = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return clock;
  const days = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  const day = days < 7 ? date.toLocaleDateString([], { weekday: "short" }) : date.toLocaleDateString([], { month: "short", day: "numeric" });
  return `${day}, ${clock}`;
}
