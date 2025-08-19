import { DestructorType } from "./DestructorType";

/**
 * Main type what accepts data
 */
export type OwnerType<T = unknown> = (v: T) => DestructorType | void;
