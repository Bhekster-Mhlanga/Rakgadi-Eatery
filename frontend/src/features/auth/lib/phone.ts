/**
 * Turns what a customer types into one standard form: +27821234567.
 * Accepts 082 123 4567, 0821234567, 27821234567, +27 82 123 4567, 0027...
 * Other countries need the + (or 00) prefix. Returns null when it is not valid.
 */
export function normalizePhone(input: string): string | null {
  const cleaned = input.trim().replace(/[\s\-().]/g, "");

  let e164: string;
  if (/^\+[0-9]+$/.test(cleaned)) e164 = cleaned;
  else if (/^00[0-9]+$/.test(cleaned)) e164 = `+${cleaned.slice(2)}`;
  else if (/^0[0-9]{9}$/.test(cleaned)) e164 = `+27${cleaned.slice(1)}`;
  else if (/^27[0-9]{9}$/.test(cleaned)) e164 = `+${cleaned}`;
  else return null;

  // South African numbers are +27 followed by exactly 9 digits.
  if (e164.startsWith("+27") && !/^\+27[1-9][0-9]{8}$/.test(e164)) return null;

  return /^\+[1-9][0-9]{7,14}$/.test(e164) ? e164 : null;
}

export function looksLikeEmail(value: string): boolean {
  return value.includes("@");
}
