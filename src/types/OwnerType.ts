/**
 * Main type what accepts data
 */
export type OwnerType<T = unknown> = (v: T) => boolean | void;
