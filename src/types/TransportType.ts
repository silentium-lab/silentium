import { EventType } from "../types/EventType";

/**
 * A function type that takes a value as an argument
 * and returns a specific value
 */
export type TransportType<P extends unknown[] = unknown[], T = unknown> = {
  of(...args: P): EventType<T>;
};
