/**
 * Date synchronization and validation utilities for Natal VIP Turismo.
 * Ensures the calendar and booking engine operate with current dates
 * and strictly prevents reservations for dates that have already passed.
 */

export function getTodayDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

/**
 * Checks if a specific day in a given year and 0-indexed month is in the past.
 */
export function isDateInPast(year: number, monthIndex: number, day: number): boolean {
  const today = getTodayDate();
  const target = new Date(year, monthIndex, day, 0, 0, 0, 0);
  return target.getTime() < today.getTime();
}

/**
 * Checks if a specific day is today.
 */
export function isDateToday(year: number, monthIndex: number, day: number): boolean {
  const today = getTodayDate();
  const target = new Date(year, monthIndex, day, 0, 0, 0, 0);
  return target.getTime() === today.getTime();
}

/**
 * Parses 'DD/MM/YYYY' or 'YYYY-MM-DD' into a Date object at 00:00:00.
 */
export function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();

  // Format DD/MM/YYYY
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day, 0, 0, 0, 0);
      }
    }
  }

  // Format YYYY-MM-DD
  if (trimmed.includes('-')) {
    const parts = trimmed.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day, 0, 0, 0, 0);
      }
    }
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0);
  }

  return null;
}

/**
 * Checks if a date string is in the past.
 */
export function isDateStringInPast(dateStr: string): boolean {
  const date = parseDateString(dateStr);
  if (!date) return false;
  const today = getTodayDate();
  return date.getTime() < today.getTime();
}

/**
 * Formats a Date object to 'DD/MM/YYYY'.
 */
export function formatDateToBR(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

/**
 * Formats a Date object to 'YYYY-MM-DD' (for HTML5 date inputs).
 */
export function formatDateToISO(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${y}-${m}-${d}`;
}

/**
 * Converts 'DD/MM/YYYY' to 'YYYY-MM-DD'.
 */
export function brDateToISO(brDate: string): string {
  const parsed = parseDateString(brDate);
  if (!parsed) return '';
  return formatDateToISO(parsed);
}

/**
 * Converts 'YYYY-MM-DD' to 'DD/MM/YYYY'.
 */
export function isoToBRDate(isoDate: string): string {
  const parsed = parseDateString(isoDate);
  if (!parsed) return '';
  return formatDateToBR(parsed);
}

/**
 * Returns the current month index (0-11) for 2026.
 */
export function getCurrentCalendarMonthIndex(): number {
  const now = new Date();
  if (now.getFullYear() === 2026) {
    return Math.min(Math.max(now.getMonth(), 0), 11);
  }
  return 8; // Default to September 2026 if outside 2026 range
}

/**
 * Returns a recommended initial date for booking that is GUARANTEED to not be in the past.
 */
export function getInitialBookingDate(): string {
  const today = getTodayDate();
  return formatDateToBR(today);
}

/**
 * Returns the ISO min string for date pickers (YYYY-MM-DD) representing today.
 */
export function getTodayISO(): string {
  return formatDateToISO(getTodayDate());
}

