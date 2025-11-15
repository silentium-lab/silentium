import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * A type that serves as both
 * an message and a transport
 */
export type SourceType<T = unknown> = MessageType<T> & TransportType<T>;
