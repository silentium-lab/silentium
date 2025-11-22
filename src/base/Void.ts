/**
 * Resolver that does nothing with the passed value,
 * needed for silent message triggering
 */
export function Void() {
  return () => {};
}
