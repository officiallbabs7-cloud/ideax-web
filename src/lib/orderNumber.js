// Turns the server's long id into a short, readable order number, e.g. IDX-CF9005C9.
// Uses the LAST 8 characters, because the first ones are based on the time and look alike.
export function orderNumber(id) {
  const raw = String(id || "");
  if (!raw) return "";
  if (/^ORD-/i.test(raw)) return raw; // demo orders already look fine
  return `IDX-${raw.replace(/-/g, "").toUpperCase().slice(-8)}`;
}