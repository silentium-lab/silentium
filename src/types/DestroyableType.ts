/**
 * Type of an object that can
 * be destroyed
 */
export interface DestroyableType {
  destroy(): this;
}

/**
 * Represents an object that can provide an answer
 * whether it was destroyed
 */
export interface DestroyedType {
  destroyed(): boolean;
}
