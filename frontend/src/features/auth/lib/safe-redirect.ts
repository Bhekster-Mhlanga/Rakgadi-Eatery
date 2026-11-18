/**
 * Only allow redirects to paths inside this site.
 * Blocks values like "https://evil.com" or "//evil.com" (open-redirect attacks).
 */
export function getSafeRedirectPath(next: string | null | undefined): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return "/";
  }
  return next;
}
