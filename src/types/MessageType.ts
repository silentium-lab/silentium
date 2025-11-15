import { TransportType } from "types/TransportType";

/**
 * The message type from which
 * values should be received
 */
export interface MessageType<T = unknown> {
  to(user: TransportType<T>): this;
}

/**
 * Value type from message
 */
export type MessageTypeValue<T> = T extends MessageType<infer U> ? U : never;
