import { TransportType } from "types/TransportType";

/**
 * The event type from which
 * values should be received
 */
export interface EventType<T = unknown> {
  event(user: TransportType<T>): this;
}

/**
 * Value type from event
 */
export type EventTypeValue<T> = T extends EventType<infer U> ? U : never;
