/**
 * Type representing the process
 * of passing a value somewhere
 */
export interface TransportType<T = unknown, R = null> {
  use(value: T): R extends null ? this : R;
}
