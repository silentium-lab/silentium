/**
 * Type that takes a value as an argument
 * and returns a specific value
 */
export type ConstructorType<P extends unknown[] = unknown[], T = unknown> = (
  ...args: P
) => T;
