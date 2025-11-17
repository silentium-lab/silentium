import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

/**
 * A type that serves as both
 * an message and a tap
 */
export type SourceType<T = unknown> = MessageType<T> & TapType<T>;
