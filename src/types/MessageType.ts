import { ConstructorType } from "types/ConstructorType";

/**
 * The message type from which
 * values should be received
 */
export interface MessageType<T = unknown> {
  then(resolved: ConstructorType<[T]>): MessageType;
  catch(rejected: ConstructorType<[unknown]>): this;
}

/**
 * Value type from message
 */
export type MessageTypeValue<T> = T extends MessageType<infer U> ? U : never;

/**
 * A type that accepts either a message or a raw value
 */
export type MaybeMessage<T = unknown> = MessageType<T> | T;
