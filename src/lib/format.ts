/** Format seconds as MM:SS.mm (or HH:MM:SS.mm when needed). */
export function formatTimecode(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  const whole = Math.floor(s);
  const frac = Math.round((s - whole) * 100)
    .toString()
    .padStart(2, "0");
  const mm = m.toString().padStart(2, "0");
  const ss = `${whole.toString().padStart(2, "0")}.${frac}`;
  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
