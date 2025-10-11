import { EventType } from "./EventType";

export interface EventObjectType<T = unknown> {
  event: EventType<T>;
}
