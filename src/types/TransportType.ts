import { DestroyableType, DestroyedType } from "types/DestroyableType";

/**
 * Type representing the process
 * of passing a value somewhere
 */
export interface TransportType<T = unknown, R = any> {
  use(value: T): R;
}

/**
 * Transport that can be destroyed
 */
export type TransportDestroyableType<T = any, R = any> = TransportType<T, R> &
  DestroyableType &
  DestroyedType;
