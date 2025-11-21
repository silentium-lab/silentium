import { MessageType } from "types/MessageType";

/**
 * A type that serves as both
 * an message and a tap
 */
export interface SourceType<T = unknown> {
  use(value: T): this;
}

/**
 * Message and source at same time
 */
export type MessageSourceType<T = unknown> = MessageType<T> & SourceType<T>;
