import { MessageType } from "types/MessageType";

/**
 * A type that can accept value
 */
export interface SourceType<T = unknown> {
  use(value: T): this;
}

/**
 * Message and source at same time
 */
export type MessageSourceType<T = unknown> = MessageType<T> & SourceType<T>;
