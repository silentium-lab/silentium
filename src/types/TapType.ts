import { DestroyableType, DestroyedType } from "types/DestroyableType";

/**
 * Type representing the process
 * of passing a value somewhere
 */
export interface TapType<T = unknown, R = any> {
  use(value: T): R;
}

/**
 * Tap that can be destroyed
 */
export type TapDestroyableType<T = any, R = any> = TapType<T, R> &
  DestroyableType &
  DestroyedType;
