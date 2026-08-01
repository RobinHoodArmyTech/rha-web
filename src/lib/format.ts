/** Format a number for display. Uses en-IN locale (Indian grouping) consistently
 *  across server and client renders. */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}
