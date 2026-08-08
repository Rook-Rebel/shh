const RECENT_WINDOW_MS = 1000 * 60 * 60 * 24 * 7;

export function isRecent(date: string): boolean {
  return Date.now() - new Date(date).getTime() < RECENT_WINDOW_MS;
}
