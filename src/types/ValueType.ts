/**
 * A function type that takes a value as an argument
 * and returns a specific value
 */
export type ValueType<P extends unknown[] = unknown[], T = unknown> = (
  ...args: P
) => T;
