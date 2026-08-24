const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Strips the time component so date-only values can be compared without
 * off-by-one errors caused by partial-day differences.
 */
function toDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Injectable clock so callers can supply a fixed "now" for deterministic
 * testing instead of this module reading Date.now() directly.
 */
export type CurrentDateSource = () => Date;

export const systemCurrentDate: CurrentDateSource = () => new Date();

/**
 * Exact whole days remaining until nextRenewalDate, comparing date-only
 * (time stripped) values. Negative values indicate the date has passed.
 */
export function daysUntilRenewal(
  nextRenewalDate: Date,
  currentDate: Date = systemCurrentDate()
): number {
  const target = toDateOnly(nextRenewalDate);
  const today = toDateOnly(currentDate);
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);
}

/**
 * True when the renewal falls within the next 7 days, inclusive
 * (0 <= days <= 7). Days already past (negative) are not "soon".
 */
export function isRenewingSoon(days: number): boolean {
  return days >= 0 && days <= 7;
}
