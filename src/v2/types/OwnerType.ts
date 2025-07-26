/**
 * Main type what accepts data
 */
export type OwnerType<T> = (v: T) => boolean | void;
