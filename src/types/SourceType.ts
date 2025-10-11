import { EventObjectType } from "./EventObjectType";
import { EventUserObjectType } from "./EventUserObjectType";

export type SourceType<T = unknown> = EventObjectType<T> &
  EventUserObjectType<T>;
