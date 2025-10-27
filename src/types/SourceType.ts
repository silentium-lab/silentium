import { EventType } from "../types/EventType";
import { TransportType } from "./TransportType";

/**
 * A type that serves as both
 * an event and a transport
 */
export type SourceType<T = unknown> = EventType<T> & TransportType<T>;
