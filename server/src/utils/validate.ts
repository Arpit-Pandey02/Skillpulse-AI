/** True when value is a string with 1..max characters after trimming. */
export const isNonEmptyString = (value: unknown, max = 200): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;

/** Simple, safe email shape check (not a full RFC validator). */
export const isValidEmail = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/**
 * Parses a number from a number or numeric string.
 * Returns null when it is not a finite number inside [min, max].
 */
export const parseNumberInRange = (value: unknown, min: number, max: number): number | null => {
  let n = NaN;
  if (typeof value === 'number') n = value;
  else if (typeof value === 'string' && value.trim() !== '') n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};

/** Escapes user text so it can be used safely inside a RegExp / $regex query. */
export const escapeRegex = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
