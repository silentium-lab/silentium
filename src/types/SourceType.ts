import { EventType } from "../types/EventType";
import { EventUserType } from "../types/EventUserType";

export type SourceType<T = unknown> = EventType<T> & EventUserType<T>;
