/**
 * Type representing the process
 * of passing a value somewhere
 */
export interface TransportType<T = unknown, R = any> {
  use(value: T): R;
}
